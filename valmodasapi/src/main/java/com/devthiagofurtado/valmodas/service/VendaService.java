package com.devthiagofurtado.valmodas.service;

import com.devthiagofurtado.valmodas.converter.DozerConverter;
import com.devthiagofurtado.valmodas.data.model.Cliente;
import com.devthiagofurtado.valmodas.data.model.Produto;
import com.devthiagofurtado.valmodas.data.model.Venda;
import com.devthiagofurtado.valmodas.data.vo.PagamentoVO;
import com.devthiagofurtado.valmodas.data.vo.ProdutoVO;
import com.devthiagofurtado.valmodas.data.vo.VendaVO;
import com.devthiagofurtado.valmodas.exception.ResourceBadRequestException;
import com.devthiagofurtado.valmodas.repository.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VendaService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private ProdutoService produtoService;

    @Autowired
    private PagamentoService pagamentoService;

    @Autowired
    private DevolucaoService devolucaoService;


    @Transactional(readOnly = false, propagation = Propagation.REQUIRED)
    public VendaVO salvar(VendaVO vendaVO, String userName) {
        userService.validarUsuarioAdmGerente(userName);
        if (vendaVO.getProdutosVOS().isEmpty()) {
            throw new ResourceBadRequestException("Não é possível emitir venda sem produtos.");
        }
        if (vendaVO.getPagamentoVOS().isEmpty()) {
            throw new ResourceBadRequestException("Não é possível emitir venda sem forma de pagamento.");
        }

        var cliente = clienteService.buscarEntityPorId(vendaVO.getClienteId());
        var venda = DozerConverter.vendaVOToEntity(vendaVO, cliente);

        venda.setSubTotal(venda.getProdutos().stream().mapToDouble(Produto::getValorVenda).sum());

        venda.setValorTotal(venda.getSubTotal() - venda.getDesconto());

        double pagamentosTotal = vendaVO.getPagamentoVOS().stream().mapToDouble(PagamentoVO::getValorPagamento).sum();

        if (venda.getValorTotal() != pagamentosTotal) {
            throw new ResourceBadRequestException("Não é possível emitir venda, diferença entre total dos produtos e total do pagamento.");
        }

        if (vendaVO.getKey() == null) {
            venda.setCadastradoEm(LocalDateTime.now());
            venda.setResponsavelCadastro(userName);
        } else {
            venda.setAtualizadoEm(LocalDateTime.now());
            venda.setResponsavelAtualizacao(userName);

        }
        var vendaSalvo = vendaRepository.save(venda);
        produtoService.venderProdutos(venda.getProdutos(), userName);

        vendaVO.getPagamentoVOS().forEach(p -> {
            p.setVendaId(vendaSalvo.getId());
        });

        var pagamentosVOS = vendaVO.getPagamentoVOS().stream().map(p -> pagamentoService.salvar(p, userName)).collect(Collectors.toList());


        return DozerConverter.vendaToVO(vendaSalvo, pagamentosVOS);

    }


    @Transactional(readOnly = true)
    public VendaVO buscarPorId(Long idVenda, String userName) {
        userService.validarUsuarioAdmGerente(userName);
        var venda = vendaRepository.findById(idVenda).orElseThrow(() -> new ResourceNotFoundException("Não Localizou o registro pelo id."));
        return DozerConverter.parseObject(venda, VendaVO.class);
    }

    private VendaVO convertToVendaVO(Venda venda) {
        var pagamentosVO = pagamentoService.buscarPorVenda(venda);
        return DozerConverter.vendaToVO(venda, pagamentosVO);
    }

    @Transactional(readOnly = true)
    public Venda buscarEntityPorId(Long idVenda) {
        return vendaRepository.findById(idVenda).orElseThrow(() -> new ResourceNotFoundException("Não Localizou o registro pelo id."));
    }

    @Transactional(readOnly = true)
    public List<VendaVO> listarVendasPorCliente(Cliente cliente) {

        return vendaRepository.findAllByCliente(cliente).stream().map(this::convertToVendaVO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<VendaVO> buscarVendasPorCliente(Long idCliente, Pageable pageable, String userName) {
        userService.validarUsuarioAdmGerente(userName);
        var cliente = clienteService.buscarEntityPorId(idCliente);
        var page = vendaRepository.findAllByCliente(cliente, pageable);

        return page.map(this::convertToVendaVO);
    }

    @Transactional(readOnly = true)
    public Page<VendaVO> buscarVendasPorClienteParaDevolucao(Long idCliente, Pageable pageable, String userName) {
        userService.validarUsuarioAdmGerente(userName);
        var cliente = clienteService.buscarEntityPorId(idCliente);
        var page = vendaRepository.findAllByCliente(cliente, pageable);
        var vo = page.map(this::convertToVendaVO);

        vo.forEach(vendaVO->{
            devolucaoService.verificaSeProdutosDaVendaPossuiDevolucao(vendaVO);
        });

        return vo;
    }


}

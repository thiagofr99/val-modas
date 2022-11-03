package com.devthiagofurtado.valmodas.service;

import com.devthiagofurtado.valmodas.converter.DozerConverter;
import com.devthiagofurtado.valmodas.data.model.Cliente;
import com.devthiagofurtado.valmodas.data.model.Devolucao;
import com.devthiagofurtado.valmodas.data.model.Produto;
import com.devthiagofurtado.valmodas.data.vo.DevolucaoVO;
import com.devthiagofurtado.valmodas.data.vo.VendaVO;
import com.devthiagofurtado.valmodas.exception.ResourceBadRequestException;
import com.devthiagofurtado.valmodas.repository.DevolucaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DevolucaoService {

    @Autowired
    private DevolucaoRepository devolucaoRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private VendaService vendaService;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private PagamentoService pagamentoService;

    @Autowired
    private ProdutoService produtoService;

    @Transactional(readOnly = false, propagation = Propagation.REQUIRED)
    public DevolucaoVO salvar(DevolucaoVO devolucaoVO, String userName) {
        userService.validarUsuarioAdmGerente(userName);
        List<Produto> produtosDisponiveis = new ArrayList<>();
        var venda = vendaService.buscarEntityPorId(devolucaoVO.getVendaId());

        var devolucao = DozerConverter.devolucaoVOToEntity(devolucaoVO, venda);
        devolucao.setCadastradoEm(LocalDateTime.now());
        devolucao.setResponsavelCadastro(userName);

        //Verificar se produtos já foram devolvidos
        var devolucoes = devolucaoRepository.findAllByVenda(venda);
        var produtosVenda = venda.getProdutos();
        List<Produto> produtosDevolvidos = new ArrayList<>();
        devolucoes.forEach(dev -> {
            produtosDevolvidos.addAll(dev.getProdutos());
        });
        if (!produtosDevolvidos.isEmpty() && produtosVenda.equals(produtosDevolvidos)) {
            throw new ResourceBadRequestException("Todos os produtos da venda " + venda.getId() + " já foram devolvidos.");
        } else {
            if (!produtosDevolvidos.isEmpty()) {
                var idsDevolucao = produtosDevolvidos.stream().map(Produto::getId).collect(Collectors.toList());
                produtosDisponiveis = produtosVenda.stream().filter(p -> !idsDevolucao.contains(p.getId())).collect(Collectors.toList());
            }
        }
        if (produtosDisponiveis.isEmpty()) {
            //devolve os produtos na solicitação
            this.devolveProdutos(devolucao.getProdutos(), userName);
        } else {
            //verifica se produtos na solicitação podem ser devolvidos
            var idDevolucoes = devolucao.getProdutos().stream().map(Produto::getId).collect(Collectors.toList());
            List<Produto> produtosADevolver = new ArrayList<>();
            produtosDisponiveis.forEach(p -> {
                if (idDevolucoes.contains(p.getId())) {
                    produtosADevolver.add(p);
                } else {
                    throw new ResourceBadRequestException("Produto " + p.getNomeProduto() + " já devolvido desta venda.");
                }
            });
            this.devolveProdutos(produtosADevolver, userName);
        }

        return DozerConverter.devolucaoToVO(devolucaoRepository.save(devolucao));
    }


    @Transactional(readOnly = true)
    public VendaVO buscarPorId(Long idVenda, String userName) {
        userService.validarUsuarioAdmGerente(userName);
        var venda = devolucaoRepository.findById(idVenda).orElseThrow(() -> new ResourceNotFoundException("Não Localizou o registro pelo id."));
        return DozerConverter.parseObject(venda, VendaVO.class);
    }

    private DevolucaoVO convertToDevolucaoVO(Devolucao devolucao) {
        return DozerConverter.devolucaoToVO(devolucao);
    }

    @Transactional(readOnly = true)
    public Devolucao buscarEntityPorId(Long idDevolucao) {
        return devolucaoRepository.findById(idDevolucao).orElseThrow(() -> new ResourceNotFoundException("Não Localizou o registro pelo id."));
    }

    @Transactional(readOnly = true)
    public List<DevolucaoVO> listarDevolucoesPorCliente(Cliente cliente) {
        return devolucaoRepository.findAllByCliente(cliente).stream().map(this::convertToDevolucaoVO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<DevolucaoVO> buscarDevolucoesPorCliente(Long idCliente, Pageable pageable, String userName) {
        userService.validarUsuarioAdmGerente(userName);
        var cliente = clienteService.buscarEntityPorId(idCliente);
        var page = devolucaoRepository.findAllByClientePageable(cliente, pageable);

        return page.map(this::convertToDevolucaoVO);
    }

    @Transactional(readOnly = false, propagation = Propagation.REQUIRED)
    public void devolveProdutos(List<Produto> produtos, String userName) {
        produtos.forEach(produto -> {
            produtoService.devolverProduto(produto, userName);
            produto.setEstoque(true);
        });

    }

    @Transactional(readOnly = false, propagation = Propagation.REQUIRED)
    public List<Devolucao> buscarDevolucoesPorIdVenda(Long idVenda) {
        var venda = vendaService.buscarEntityPorId(idVenda);
        return devolucaoRepository.findAllByVenda(venda);

    }

    public void verificaSeProdutosDaVendaPossuiDevolucao(VendaVO vendaVO) {

        var devolucoes = this.buscarDevolucoesPorIdVenda(vendaVO.getKey());

        List<Produto> produtosDevolvidos = new ArrayList<>();
        devolucoes.forEach(d -> {
            produtosDevolvidos.addAll(d.getProdutos());
        });

        Map<Long, Long> idProdutoDevolucao = new HashMap<Long, Long>();
        devolucoes.forEach(d -> {
            var idProdutos = d.getProdutos().stream().map(Produto::getId).collect(Collectors.toList());
            idProdutos.forEach(ip -> {
                idProdutoDevolucao.put(ip, d.getId());
            });
        });


        vendaVO.getProdutosVOS().forEach(pv -> {

            if (idProdutoDevolucao.containsKey(pv.getKey())) {
                pv.setPossuiDevolucao(true);
                pv.setIdDevolucao(idProdutoDevolucao.get(pv.getKey()));
            } else {
                pv.setPossuiDevolucao(false);
            }
        });

    }

}

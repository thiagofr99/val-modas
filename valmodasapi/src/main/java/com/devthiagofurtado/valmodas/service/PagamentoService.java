package com.devthiagofurtado.valmodas.service;

import com.devthiagofurtado.valmodas.converter.DozerConverter;
import com.devthiagofurtado.valmodas.data.model.Pagamento;
import com.devthiagofurtado.valmodas.data.vo.PagamentoVO;
import com.devthiagofurtado.valmodas.repository.PagamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PagamentoService {

    @Autowired
    private PagamentoRepository pagamentoRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private VendaService vendaService;


    @Transactional(readOnly = false, propagation = Propagation.REQUIRED)
    public PagamentoVO salvar(PagamentoVO pagamentoVO, String userName) {
        userService.validarUsuarioAdmGerente(userName);

        var venda = vendaService.buscarEntityPorId(pagamentoVO.getVendaId());
        var pagamento = DozerConverter.pagamentoVOToEntity(pagamentoVO, venda);

        if (pagamentoVO.getKey() == null) {
            pagamento.setCadastradoEm(LocalDateTime.now());
            pagamento.setResponsavelCadastro(userName);
        } else {
            pagamento.setAtualizadoEm(LocalDateTime.now());
            pagamento.setResponsavelAtualizacao(userName);

        }
        var pagamentoSalvo = pagamentoRepository.save(pagamento);

        return DozerConverter.pagamentoToVO(pagamentoSalvo);

    }


    @Transactional(readOnly = true)
    public PagamentoVO buscarPorId(Long idPagamento, String userName) {
        userService.validarUsuarioAdmGerente(userName);
        var pagamento = pagamentoRepository.findById(idPagamento).orElseThrow(() -> new ResourceNotFoundException("Não Localizou o registro pelo id."));
        return DozerConverter.pagamentoToVO(pagamento);
    }

    @Transactional(readOnly = true)
    public Pagamento buscarEntityPorId(Long idPagamento) {
        return pagamentoRepository.findById(idPagamento).orElseThrow(() -> new ResourceNotFoundException("Não Localizou o registro pelo id."));
    }

}

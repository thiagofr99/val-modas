package com.devthiagofurtado.valmodas.service;

import com.devthiagofurtado.valmodas.converter.DozerConverter;
import com.devthiagofurtado.valmodas.data.model.Pagamento;
import com.devthiagofurtado.valmodas.data.model.Venda;
import com.devthiagofurtado.valmodas.data.vo.PagamentoVO;
import com.devthiagofurtado.valmodas.exception.ResourceBadRequestException;
import com.devthiagofurtado.valmodas.repository.PagamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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

        switch (pagamento.getFormaPagamentos()){
            case DINHEIRO:
            case PROMISSORIA:
                pagamento.setNumeroParcelas(0);
                break;
            case CARTAO_A_VISTA:
                pagamento.setNumeroParcelas(1);
                break;
            case CARTAO_A_PRAZO:
                if(pagamento.getNumeroParcelas()<=1){
                    throw new ResourceBadRequestException("Quantidades de parcelas indevidas para pagamento a prazo.");
                }
                break;
            default:
                throw new ResourceBadRequestException("Forma de pagamento indevida.");
        }

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
    public List<PagamentoVO> buscarPorVenda(Venda venda) {

        return pagamentoRepository.findAllByVenda(venda).stream().map(DozerConverter::pagamentoToVO).collect(Collectors.toList());
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

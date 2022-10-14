package com.devthiagofurtado.valmodas.service;

import com.devthiagofurtado.valmodas.converter.DozerConverter;
import com.devthiagofurtado.valmodas.data.model.Fornecedor;
import com.devthiagofurtado.valmodas.data.vo.FornecedorVO;
import com.devthiagofurtado.valmodas.repository.FornecedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;

@Service
public class FornecedorService {

    @Autowired
    private FornecedorRepository fornecedorRepository;

    @Autowired
    private UserService userService;


    @Transactional(readOnly = false, propagation = Propagation.REQUIRED)
    public FornecedorVO salvar(FornecedorVO fornecedorVO, String userName) {
        userService.validarUsuarioAdmGerente(userName);

        var fornecedor = DozerConverter.parseObject(fornecedorVO, Fornecedor.class);

        if (fornecedorVO.getKey() == null) {
            fornecedor.setCadastradoEm(LocalDateTime.now());
            fornecedor.setResponsavelCadastro(userName);
        } else {
            fornecedor.setAtualizadoEm(LocalDateTime.now());
            fornecedor.setResponsavelAtualizacao(userName);

        }
        var fornecedorSalvo = fornecedorRepository.save(fornecedor);
        return DozerConverter.parseObject(fornecedorSalvo, FornecedorVO.class);

    }


    @Transactional(readOnly = true)
    public FornecedorVO buscarPorId(Long idFornecedor, String userName) {
        userService.validarUsuarioAdmGerente(userName);
        var fornecedor = fornecedorRepository.findById(idFornecedor).orElseThrow(() -> new ResourceNotFoundException("Não Localizou o registro pelo id."));
        return DozerConverter.parseObject(fornecedor, FornecedorVO.class);
    }

    @Transactional(readOnly = true)
    public FornecedorVO buscarPorIdInterno(Long idFornecedor) {
        var fornecedor = fornecedorRepository.findById(idFornecedor).orElseThrow(() -> new ResourceNotFoundException("Não Localizou o registro pelo id."));
        return DozerConverter.parseObject(fornecedor, FornecedorVO.class);
    }

    @Transactional(readOnly = true)
    public Page<FornecedorVO> buscarPorNomeOuParteDoNome(String busca, Pageable pageable, String userName) {
        userService.validarUsuarioAdmGerente(userName);

        var page = fornecedorRepository.findAllByFornecedorName(busca, pageable);

        return  page.map(this::convertToFornecedorVO);
    }

    private FornecedorVO convertToFornecedorVO(Fornecedor fornecedor) {
        return DozerConverter.parseObject(fornecedor, FornecedorVO.class);
    }

    @Transactional(readOnly = true)
    public Fornecedor buscarEntityPorId(Long idFornecedor) {
        return fornecedorRepository.findById(idFornecedor).orElseThrow(() -> new ResourceNotFoundException("Não Localizou o registro pelo id."));
    }

}

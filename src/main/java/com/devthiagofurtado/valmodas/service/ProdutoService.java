package com.devthiagofurtado.valmodas.service;

import com.devthiagofurtado.valmodas.converter.DozerConverter;
import com.devthiagofurtado.valmodas.data.model.Produto;
import com.devthiagofurtado.valmodas.data.vo.ProdutoVO;
import com.devthiagofurtado.valmodas.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private FornecedorService fornecedorService;

    @Autowired
    private UserService userService;


    @Transactional(readOnly = false, propagation = Propagation.REQUIRED)
    public ProdutoVO salvar(ProdutoVO produtoVO, String userName) {
        userService.validarUsuarioAdmGerente(userName);

        var produto = DozerConverter.parseObject(produtoVO, Produto.class);
        if (produtoVO.getFornecedorId() != null) {
            produto.setFornecedor(fornecedorService.buscarEntityPorId(produtoVO.getFornecedorId()));
        }
        if (produtoVO.getKey() == null) {
            produto.setCadastradoEm(LocalDateTime.now());
            produto.setResponsavelCadastro(userName);
        } else {
            produto.setAtualizadoEm(LocalDateTime.now());
            produto.setResponsavelAtualizacao(userName);

        }
        var produtoSalvo = produtoRepository.save(produto);
        return DozerConverter.parseObject(produtoSalvo, ProdutoVO.class);

    }


    @Transactional(readOnly = true)
    public ProdutoVO buscarPorId(Long idProduto, String userName) {
        userService.validarUsuarioAdmGerente(userName);
        var produto = produtoRepository.findById(idProduto).orElseThrow(() -> new ResourceNotFoundException("Não Localizou o registro pelo id."));
        return DozerConverter.parseObject(produto, ProdutoVO.class);
    }

    @Transactional(readOnly = true)
    public Page<ProdutoVO> buscarPorNomeOuParteDoNome(String busca, Pageable pageable, String userName) {
        userService.validarUsuarioAdmGerente(userName);

        var page = produtoRepository.findAllByProdutoName(busca, pageable);

        return page.map(this::convertToProdutoVO);
    }

    @Transactional(readOnly = true)
    public Page<ProdutoVO> buscarPorFornecedor(Long idFornecedor, Pageable pageable, String userName) {
        userService.validarUsuarioAdmGerente(userName);
        var fornecedor = fornecedorService.buscarEntityPorId(idFornecedor);
        var page = produtoRepository.findAllByFornecedor(fornecedor, pageable);

        return page.map(this::convertToProdutoVO);
    }

    private ProdutoVO convertToProdutoVO(Produto produto) {
        return DozerConverter.parseObject(produto, ProdutoVO.class);
    }

}

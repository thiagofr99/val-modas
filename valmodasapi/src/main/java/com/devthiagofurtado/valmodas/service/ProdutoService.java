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
import java.util.List;

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
            produto.setEstoque(true);
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
        var produtoVO = DozerConverter.parseObject(produto, ProdutoVO.class);
        produtoVO.setFornecedorId(produto.getFornecedor().getId());
        produtoVO.setFornecedorVO( fornecedorService.buscarPorIdInterno(produto.getFornecedor().getId()) );
        return produtoVO;
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
        var vo = DozerConverter.parseObject(produto, ProdutoVO.class);
        if(produto.getFornecedor()!=null) vo.setFornecedorVO( fornecedorService.buscarPorIdInterno(produto.getFornecedor().getId()) );
        return vo;
    }

    @Transactional(readOnly = true)
    public Produto buscarEntityPorId(Long idProduto) {
        return produtoRepository.findById(idProduto).orElseThrow(() -> new ResourceNotFoundException("Não Localizou o registro pelo id."));
    }

    @Transactional(readOnly = false, propagation = Propagation.REQUIRED)
    public void venderProdutos(List<Produto> produtos, String userName){
        produtos.forEach(p->{
            Produto pdt = buscarEntityPorId(p.getId());
            pdt.setAtualizadoEm(LocalDateTime.now());
            pdt.setResponsavelAtualizacao(userName);
            pdt.setEstoque(false);
            produtoRepository.save(pdt);
        });
    }
    @Transactional(readOnly = false, propagation = Propagation.REQUIRED)
    public void devolverProduto(Produto produto, String userName) {
        Produto pdt = buscarEntityPorId(produto.getId());
        pdt.setAtualizadoEm(LocalDateTime.now());
        pdt.setResponsavelAtualizacao(userName);
        pdt.setEstoque(true);
        produtoRepository.save(pdt);
    }
}

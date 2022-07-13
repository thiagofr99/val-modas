package com.devthiagofurtado.valmodas.service;

import com.devthiagofurtado.valmodas.data.model.Fornecedor;
import com.devthiagofurtado.valmodas.data.model.Produto;
import com.devthiagofurtado.valmodas.modelCreator.FornecededorModelCreator;
import com.devthiagofurtado.valmodas.modelCreator.ProdutoModelCreator;
import com.devthiagofurtado.valmodas.repository.ProdutoRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.BDDMockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;

@ExtendWith(SpringExtension.class)
class ProdutoServiceTest {

    @InjectMocks
    private ProdutoService produtoService;

    @Mock
    private ProdutoRepository produtoRepository;

    @Mock
    private UserService userService;

    @Mock
    private FornecedorService fornecedorService;

    @BeforeEach
    void setUp() {
        BDDMockito.when(produtoRepository.save(ArgumentMatchers.any(Produto.class)))
                .thenReturn(ProdutoModelCreator.cadastrado());

        BDDMockito.when(produtoRepository.findById(ArgumentMatchers.anyLong()))
                .thenReturn(Optional.of(ProdutoModelCreator.cadastrado()));

        BDDMockito.when(fornecedorService.buscarEntityPorId(ArgumentMatchers.anyLong()))
                .thenReturn(FornecededorModelCreator.cadastrado());

        BDDMockito.when(produtoRepository.findAllByProdutoName(ArgumentMatchers.anyString(), ArgumentMatchers.any(Pageable.class)))
                .thenReturn(new PageImpl<>(Collections.singletonList(ProdutoModelCreator.cadastrado())));

        BDDMockito.when(produtoRepository.findAllByFornecedor(ArgumentMatchers.any(Fornecedor.class), ArgumentMatchers.any(Pageable.class)))
                .thenReturn(new PageImpl<>(Collections.singletonList(ProdutoModelCreator.cadastrado())));

        BDDMockito.doNothing().when(userService).validarUsuarioAdmGerente(ArgumentMatchers.anyString());

    }

    @Test
    void salvar_retornaProdutoVO_sucesso() {

        var salvo = produtoService.salvar(ProdutoModelCreator.vo(), "teste");

        Assertions.assertThat(salvo).isNotNull();
        Assertions.assertThat(salvo.getKey()).isNotNull();

    }

    @Test
    void buscarPorId_retornaProdutoVO_sucesso() {
        var produto = produtoService.buscarPorId(1L, "teste");

        Assertions.assertThat(produto).isNotNull();
        Assertions.assertThat(produto.getKey()).isNotNull();
    }

    @Test
    void buscarPorNomeOuParteDoNome_retornaPageVo_sucesso() {
        Pageable pageable = PageRequest.of(1, 12);

        var produtos = produtoService.buscarPorNomeOuParteDoNome("teste", pageable, "teste");

        Assertions.assertThat(produtos).isNotEmpty();
        Assertions.assertThat(produtos.get().collect(Collectors.toList()).get(0).getKey()).isNotNull();
    }

    @Test
    void buscarPorFornecedor_retornaPageVo_sucesso() {
        Pageable pageable = PageRequest.of(1, 12);

        var produtos = produtoService.buscarPorFornecedor(1L, pageable, "teste");

        Assertions.assertThat(produtos).isNotEmpty();
        Assertions.assertThat(produtos.get().collect(Collectors.toList()).get(0).getKey()).isNotNull();
    }
}
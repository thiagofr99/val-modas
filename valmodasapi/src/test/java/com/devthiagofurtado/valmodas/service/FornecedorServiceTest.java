package com.devthiagofurtado.valmodas.service;

import com.devthiagofurtado.valmodas.data.model.Fornecedor;
import com.devthiagofurtado.valmodas.data.model.Produto;
import com.devthiagofurtado.valmodas.modelCreator.FornecededorModelCreator;
import com.devthiagofurtado.valmodas.modelCreator.ProdutoModelCreator;
import com.devthiagofurtado.valmodas.repository.FornecedorRepository;
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

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
class FornecedorServiceTest {

    @InjectMocks
    private FornecedorService fornecedorService;

    @Mock
    private FornecedorRepository fornecedorRepository;

    @Mock
    private UserService userService;


    @BeforeEach
    void setUp() {
        BDDMockito.when(fornecedorRepository.save(ArgumentMatchers.any(Fornecedor.class)))
                .thenReturn(FornecededorModelCreator.cadastrado());

        BDDMockito.when(fornecedorRepository.findById(ArgumentMatchers.anyLong()))
                .thenReturn(Optional.of(FornecededorModelCreator.cadastrado()));


        BDDMockito.when(fornecedorRepository.findAllByFornecedorName(ArgumentMatchers.anyString(), ArgumentMatchers.any(Pageable.class)))
                .thenReturn(new PageImpl<>(Collections.singletonList(FornecededorModelCreator.cadastrado())));

        BDDMockito.doNothing().when(userService).validarUsuarioAdmGerente(ArgumentMatchers.anyString());
    }

    @Test
    void salvar_retornaFornecedorVO_sucesso() {
        var salvo = fornecedorService.salvar(FornecededorModelCreator.vo(), "teste");

        Assertions.assertThat(salvo).isNotNull();
        Assertions.assertThat(salvo.getKey()).isNotNull();
    }

    @Test
    void buscarPorId_retornaFornecedorVO_sucesso() {
        var fornecedor = fornecedorService.buscarPorId(1L, "teste");

        Assertions.assertThat(fornecedor).isNotNull();
        Assertions.assertThat(fornecedor.getKey()).isNotNull();
    }

    @Test
    void buscarPorNomeOuParteDoNome_retornaPageFornecedorVO_sucesso() {
        Pageable pageable = PageRequest.of(1, 12);

        var fornecedores = fornecedorService.buscarPorNomeOuParteDoNome("teste", pageable, "teste");

        Assertions.assertThat(fornecedores).isNotEmpty();
        Assertions.assertThat(fornecedores.get().collect(Collectors.toList()).get(0).getKey()).isNotNull();
    }

    @Test
    void buscarEntityPorId_retornaFornecedor_sucesso() {
        var fornecedor = fornecedorService.buscarEntityPorId(1L);

        Assertions.assertThat(fornecedor).isNotNull();
        Assertions.assertThat(fornecedor.getId()).isNotNull();
    }
}
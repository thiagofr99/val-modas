package com.devthiagofurtado.valmodas.service;

import com.devthiagofurtado.valmodas.data.model.Cliente;
import com.devthiagofurtado.valmodas.data.model.Fornecedor;
import com.devthiagofurtado.valmodas.data.model.Produto;
import com.devthiagofurtado.valmodas.modelCreator.ClienteModelCreator;
import com.devthiagofurtado.valmodas.modelCreator.FornecededorModelCreator;
import com.devthiagofurtado.valmodas.modelCreator.ProdutoModelCreator;
import com.devthiagofurtado.valmodas.repository.ClienteRepository;
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
class ClienteServiceTest {

    @InjectMocks
    private ClienteService clienteService;

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private UserService userService;


    @BeforeEach
    void setUp() {
        BDDMockito.when(clienteRepository.save(ArgumentMatchers.any(Cliente.class)))
                .thenReturn(ClienteModelCreator.cadastrado());

        BDDMockito.when(clienteRepository.findById(ArgumentMatchers.anyLong()))
                .thenReturn(Optional.of(ClienteModelCreator.cadastrado()));

        BDDMockito.when(clienteRepository.findAllByClienteName(ArgumentMatchers.anyString(), ArgumentMatchers.any(Pageable.class)))
                .thenReturn(new PageImpl<>(Collections.singletonList(ClienteModelCreator.cadastrado())));


        BDDMockito.doNothing().when(userService).validarUsuarioAdmGerente(ArgumentMatchers.anyString());
    }

    @Test
    void salvar_retornaClienteVO_sucesso() {
        var salvo = clienteService.salvar(ClienteModelCreator.vo(), "teste");

        Assertions.assertThat(salvo).isNotNull();
        Assertions.assertThat(salvo.getKey()).isNotNull();
    }

    @Test
    void buscarPorId_retornaClienteVO_sucesso() {
        var clienteVO = clienteService.buscarPorId(1L, "teste");

        Assertions.assertThat(clienteVO).isNotNull();
        Assertions.assertThat(clienteVO.getKey()).isNotNull();
    }

    @Test
    void buscarPorNomeOuParteDoNome_retornaClienteVO_sucesso() {
        Pageable pageable = PageRequest.of(1, 12);

        var clienteVOS = clienteService.buscarPorNomeOuParteDoNome("teste", pageable, "teste");

        Assertions.assertThat(clienteVOS).isNotEmpty();
        Assertions.assertThat(clienteVOS.get().collect(Collectors.toList()).get(0).getKey()).isNotNull();
    }

    @Test
    void buscarEntityPorId() {
        var cliente = clienteService.buscarEntityPorId(1L);

        Assertions.assertThat(cliente).isNotNull();
        Assertions.assertThat(cliente.getId()).isNotNull();
    }
}
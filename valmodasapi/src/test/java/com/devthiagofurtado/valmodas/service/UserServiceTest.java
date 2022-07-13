package com.devthiagofurtado.valmodas.service;

import com.devthiagofurtado.valmodas.data.model.User;
import com.devthiagofurtado.valmodas.data.vo.PermissionVO;
import com.devthiagofurtado.valmodas.data.vo.UsuarioVO;
import com.devthiagofurtado.valmodas.exception.ResourceBadRequestException;
import com.devthiagofurtado.valmodas.modelCreator.UserModelCreator;
import com.devthiagofurtado.valmodas.repository.UserRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.BDDMockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;

@ExtendWith(SpringExtension.class)
class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserDetailsService userDetailsService;

    UserServiceTest() {
    }

    @BeforeEach
    void setUp() {

        BDDMockito.when(userRepository.save(ArgumentMatchers.any(User.class)))
                .thenReturn(UserModelCreator.cadastrado(null, UserModelCreator.permissions(PermissionVO.ADMIN), true));

        BDDMockito.when(userRepository.findByUsername(ArgumentMatchers.anyString()))
                .thenReturn(UserModelCreator.cadastrado(null, UserModelCreator.permissions(PermissionVO.ADMIN), true));

        BDDMockito.when(userRepository.findById(ArgumentMatchers.anyLong()))
                .thenReturn(Optional.of(UserModelCreator.cadastrado(null, UserModelCreator.permissions(PermissionVO.ADMIN), true)));

        BDDMockito.when(userDetailsService.loadUserByUsername(ArgumentMatchers.anyString()))
                .thenReturn(UserModelCreator.userDetails(UserModelCreator.cadastrado(null, UserModelCreator.permissions(PermissionVO.ADMIN), true)));

        BDDMockito.when(userRepository.findAllByUserName(ArgumentMatchers.anyString(), ArgumentMatchers.any(Pageable.class)))
                .thenReturn(new PageImpl<>(Collections.singletonList(UserModelCreator.cadastrado(LocalDate.now(),
                        UserModelCreator.permissions(PermissionVO.ADMIN),
                        true))));

    }

    @Test
    void loadUserByUsername_retornaUserDetails_sucesso() {

        var teste = userService.loadUserByUsername("teste");
        Assertions.assertThat(teste).isNotNull();
        Assertions.assertThat(teste.getAuthorities()).isNotNull().isNotEmpty();
    }

    @Test
    void loadUserByUsername_retornaUserNameNotFoundException_erro() {

        BDDMockito.when(userRepository.findByUsername(ArgumentMatchers.anyString()))
                .thenReturn(null);

        Assertions.assertThatThrownBy(() -> userService.loadUserByUsername("teste"))
                .isInstanceOf(UsernameNotFoundException.class);
    }

    @Test
    void salvar_retornaUsuarioVO_sucesso() {
        var permissions = Collections.singletonList(PermissionVO.ADMIN);
        var teste = userService.salvar(UserModelCreator.vo(permissions, true, false), "teste");

        Assertions.assertThat(teste).isNotNull();
        Assertions.assertThat(teste.getKey()).isNotNull();

    }

    @Test
    void salvar_retornaResourceBadRequestExcepiton_erro() {
        var permissions = Collections.singletonList(PermissionVO.COMMON_USER);

        BDDMockito.when(userRepository.findByUsername(ArgumentMatchers.anyString()))
                .thenReturn(UserModelCreator.cadastrado(null, UserModelCreator.permissions(PermissionVO.COMMON_USER), true));

        Assertions.assertThatThrownBy(() -> userService.salvar(UserModelCreator.vo(permissions, true, false), "teste"))
                .isInstanceOf(ResourceBadRequestException.class);
    }

    @Test
    void findById_retornaUsuarioVO_sucesso() {

        var permissions = Collections.singletonList(PermissionVO.ADMIN);
        var teste = userService.findById(1L, "teste");

        Assertions.assertThat(teste).isNotNull();
        Assertions.assertThat(teste.getKey()).isNotNull();
    }

    @Test
    void findById_retornaResourceBadRequestExcepiton_erro() {
        var permissions = Collections.singletonList(PermissionVO.COMMON_USER);

        BDDMockito.when(userRepository.findByUsername(ArgumentMatchers.anyString()))
                .thenReturn(UserModelCreator.cadastrado(null, UserModelCreator.permissions(PermissionVO.COMMON_USER), true));

        Assertions.assertThatThrownBy(() -> userService.salvar(UserModelCreator.vo(permissions, true, false), "teste"))
                .isInstanceOf(ResourceBadRequestException.class);
    }

    @Test
    void habilitarLicensaTrintaDias_sucesso() {
        BDDMockito.when(userRepository.findByUsername(ArgumentMatchers.anyString()))
                .thenReturn(UserModelCreator.cadastrado(LocalDate.now().minusDays(10), UserModelCreator.permissions(PermissionVO.ADMIN), true));

        BDDMockito.when(userRepository.findById(ArgumentMatchers.anyLong()))
                .thenReturn(Optional.of(UserModelCreator.cadastrado(LocalDate.now().minusDays(10), UserModelCreator.permissions(PermissionVO.ADMIN), false)));

        userService.habilitarLicencaTrintaDias(1L, "teste");

    }

    @Test
    void habilitarLicensaTrintaDias_retornaResourceBadRequestExcepiton_erroUsuarioLicencaValida() {

        Assertions.assertThatThrownBy(() -> userService.habilitarLicencaTrintaDias(1L, "teste"))
                .isInstanceOf(ResourceBadRequestException.class);

    }

    @Test
    void habilitarLicensaTrintaDias_retornaResourceBadRequestExcepiton_erroUsuarioNaoAdm() {

        BDDMockito.when(userRepository.findByUsername(ArgumentMatchers.anyString()))
                .thenReturn(UserModelCreator.cadastrado(null, UserModelCreator.permissions(PermissionVO.COMMON_USER), true));

        Assertions.assertThatThrownBy(() -> userService.habilitarLicencaTrintaDias(1L, "teste"))
                .isInstanceOf(ResourceBadRequestException.class);
    }

    @Test
    void findAllByUserName_retornaPageUsuarioVO_sucesso() {
        Pageable pageable = PageRequest.of(1, 12);

        Page<UsuarioVO> teste = userService.findAllByUserName("", pageable, "teste");

        Assertions.assertThat(teste).isNotNull().isNotEmpty();
        Assertions.assertThat(teste.get().collect(Collectors.toList()).get(0).getKey()).isNotNull();

    }

    @Test
    void findAllByUserName_retornaResourceBadRequestExcepiton_erro() {
        Pageable pageable = PageRequest.of(1, 12);

        BDDMockito.when(userRepository.findByUsername(ArgumentMatchers.anyString()))
                .thenReturn(UserModelCreator.cadastrado(null, UserModelCreator.permissions(PermissionVO.COMMON_USER), true));

        Assertions.assertThatThrownBy(() -> userService.findAllByUserName("", pageable, "teste"))
                .isInstanceOf(ResourceBadRequestException.class);
    }
}
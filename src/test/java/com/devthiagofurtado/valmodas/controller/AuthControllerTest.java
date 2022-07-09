package com.devthiagofurtado.valmodas.controller;

import com.devthiagofurtado.valmodas.data.vo.PermissionVO;
import com.devthiagofurtado.valmodas.data.vo.UsuarioVO;
import com.devthiagofurtado.valmodas.modelCreator.UserModelCreator;
import com.devthiagofurtado.valmodas.security.AccountCredentialsVO;
import com.devthiagofurtado.valmodas.security.jwt.JwtTokenProvider;
import com.devthiagofurtado.valmodas.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.BDDMockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.util.LinkedMultiValueMap;

import java.nio.charset.StandardCharsets;
import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @InjectMocks
    private AuthController authController;

    @Mock
    private UserService userService;

    @Mock
    JwtTokenProvider jwtTokenProvider;

    @Mock
    AuthenticationManager authenticationManager;

    @Mock
    private PagedResourcesAssembler<UsuarioVO> assembler;

    @Autowired
    private ObjectMapper mapper;

    private final String BASE_URL = "/auth";

    public static final MediaType APPLICATION_JSON_UTF8 = new MediaType(MediaType.APPLICATION_JSON.getType(),
            MediaType.APPLICATION_JSON.getSubtype(), StandardCharsets.UTF_8);

    private HttpHeaders headers;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        mapper.configure(SerializationFeature.WRITE_DATE_TIMESTAMPS_AS_NANOSECONDS, false);
        headers = new HttpHeaders();
        headers.add("Accept", "application/json");
        headers.add("Authorization", "blablabla");

        var user = UserModelCreator.vo(UserModelCreator.permissionVOS(PermissionVO.ADMIN), true, true);

        BDDMockito.when(userService.findById(ArgumentMatchers.anyLong(), ArgumentMatchers.anyString()))
                .thenReturn(user);

        BDDMockito.when(userService.findAllByUserName(ArgumentMatchers.anyString(), ArgumentMatchers.any(Pageable.class), ArgumentMatchers.anyString()))
                .thenReturn(new PageImpl<>(Collections.singletonList(user)));

        BDDMockito.when(userService.salvar(ArgumentMatchers.any(UsuarioVO.class), ArgumentMatchers.anyString()))
                .thenReturn(user);

        BDDMockito.when(userService.findByUserName(ArgumentMatchers.anyString()))
                .thenReturn(UserModelCreator.cadastrado(null, UserModelCreator.permissions(PermissionVO.ADMIN), true));

        BDDMockito.when(userService.loadUserByUsername(ArgumentMatchers.anyString()))
                .thenReturn(UserModelCreator.userDetails(UserModelCreator.cadastrado(null, UserModelCreator.permissions(PermissionVO.ADMIN), true)));

        BDDMockito.when(jwtTokenProvider.getUsername(ArgumentMatchers.anyString()))
                .thenReturn("teste");

        BDDMockito.doNothing().when(userService).habilitarLicencaTrintaDias(ArgumentMatchers.anyLong(), ArgumentMatchers.anyString());

    }


    @Test
    void signin() throws Exception {
        String jsonRequest = mapper.writeValueAsString(AccountCredentialsVO.builder().password("123test").username("teste").build());

        mockMvc.perform(post(BASE_URL + "/signin").headers(headers).contentType(APPLICATION_JSON_UTF8).content(jsonRequest)).andExpect(status().isOk());
    }

    @Test
    void salvarUsuario() throws Exception {
        String jsonRequest = mapper.writeValueAsString(UserModelCreator.jsonTest(UserModelCreator.vo(UserModelCreator.permissionVOS(PermissionVO.ADMIN), true, false)));

        mockMvc.perform(post(BASE_URL + "/salvar").headers(headers).contentType(APPLICATION_JSON_UTF8).content(jsonRequest)).andExpect(status().isCreated());
    }

    @Test
    void buscarPorId() throws Exception {
        mockMvc.perform(get(BASE_URL + "/1").headers(headers)).andExpect(status().isOk());
    }

    @Test
    void habilitarLicencaTrintaDias() throws Exception {
        mockMvc.perform(patch(BASE_URL + "/1").headers(headers)).andExpect(status().isOk());
    }

    @Test
    void findAllByUserName() throws Exception {
        LinkedMultiValueMap<String, String> param = new LinkedMultiValueMap<>();
        param.add("page", "1");
        param.add("limit", "10");
        param.add("direction", "ASC");
        param.add("userName", "a");
        mockMvc.perform(get(BASE_URL + "/findAllByUserName").params(param).headers(headers)).andExpect(status().isOk());
    }
}
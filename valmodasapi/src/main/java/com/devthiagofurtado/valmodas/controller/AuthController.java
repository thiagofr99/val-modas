package com.devthiagofurtado.valmodas.controller;


import com.devthiagofurtado.valmodas.data.vo.PermissionVO;
import com.devthiagofurtado.valmodas.data.vo.UsuarioVO;
import com.devthiagofurtado.valmodas.exception.ResourceBadRequestException;
import com.devthiagofurtado.valmodas.security.AccountCredentialsVO;
import com.devthiagofurtado.valmodas.security.jwt.JwtTokenProvider;
import com.devthiagofurtado.valmodas.service.UserService;
import com.devthiagofurtado.valmodas.util.HeaderUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import static org.springframework.http.ResponseEntity.ok;


@Api(tags = "AuthenticationEndpoint")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserService userService;

    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    private PagedResourcesAssembler<UsuarioVO> assembler;

    @ApiOperation(value = "Authenticates a user and returns a token")
    @SuppressWarnings("rawtypes")
    @PostMapping(value = "/signin", produces = {"application/json", "application/xml", "application/x-yaml"},
            consumes = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity signin(@RequestBody AccountCredentialsVO data) {

        var username = data.getUsername();
        var pasword = data.getPassword();
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, pasword));
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid username/password supplied!");
        }


        var user = userService.findByUserName(username);

        var token = "";

        if (user != null) {
            if (user.getDateLicense() == null || user.getDateLicense().isAfter(LocalDate.now())) {
                token = tokenProvider.createToken(username, user.getRoles());
            } else {
                throw new ResourceBadRequestException("Data de licença expirou em " + user.getDateLicense() + ", entre em  contato com o administrador do sistema.");
            }

        } else {
            throw new ResourceBadRequestException("Erro ao tentar conexão.");
        }

        Map<Object, Object> model = new HashMap<>();
        model.put("username", username);
        model.put("token", token);
        model.put("permission", user.getPermissions().get(0));
        return ok(model);

    }

    @ApiOperation(value = "Saves user and returns a VO if user's permission is admin.")
    @PostMapping(value = "/salvar", produces = {"application/json", "application/xml", "application/x-yaml"},
            consumes = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity<UsuarioVO> salvarUsuario(@RequestBody UsuarioVO user) {
        String token = HeaderUtil.obterToken();
        String userAdmin = tokenProvider.getUsername(token.substring(7, token.length()));
        return new ResponseEntity<>(userService.salvar(user, userAdmin), HttpStatus.CREATED);

    }

    @ApiOperation(value = "Find user by ID and return a VO if user's permission is admin.")
    @GetMapping(value = "/{id}", produces = {"application/json", "application/xml", "application/x-yaml"})
    public UsuarioVO buscarPorId(@PathVariable(value = "id") Long id) {
        String token = HeaderUtil.obterToken();
        String userAdmin = tokenProvider.getUsername(token.substring(7, token.length()));
        UsuarioVO personVO = userService.findById(id, userAdmin);
        personVO.add(linkTo(methodOn(AuthController.class).buscarPorId(id)).withSelfRel());
        return personVO;
    }

    @ApiOperation(value = "User Admin Generates a 30 day license for another user by Id.")
    @PatchMapping("/{id}")
    public ResponseEntity<UsuarioVO> habilitarLicencaTrintaDias(@PathVariable(value = "id") Long id) {
        String token = HeaderUtil.obterToken();
        String userAdmin = tokenProvider.getUsername(token.substring(7, token.length()));
        userService.habilitarLicencaTrintaDias(id, userAdmin);
        UsuarioVO vo = userService.findById(id, userAdmin);
        vo.add(linkTo(methodOn(AuthController.class).buscarPorId(vo.getKey())).withSelfRel());
        return new ResponseEntity<>(vo, HttpStatus.OK);
    }

    @ApiOperation(value = "Find all User's by userName if user requesting permission is admin")
    @GetMapping(value = {"/findAllByUserName"}, produces = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity<?> buscarTodosPorUserName(@RequestParam(value = "page", defaultValue = "0") int page,
                                                    @RequestParam(value = "limit", defaultValue = "12") int limit,
                                                    @RequestParam(value = "direction", defaultValue = "ASC") String direction,
                                                    @RequestParam(value = "userName", defaultValue = "") String userName

    ) {
        String token = HeaderUtil.obterToken();
        String userAdmin = tokenProvider.getUsername(token.substring(7, token.length()));
        var sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, limit, Sort.by(sortDirection, "userName"));
        Page<UsuarioVO> usuarioVOS = userService.findAllByUserName(userName, pageable, userAdmin);
        usuarioVOS.forEach(p -> {
            p.add(linkTo(methodOn(AuthController.class).buscarPorId(p.getKey())).withSelfRel());
        });
        return new ResponseEntity<>(assembler.toResource(usuarioVOS), HttpStatus.OK);
    }

    @ApiOperation(value = "Find Permissions.")
    @GetMapping(value = "/permissions", produces = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity<List<PermissionVO>> listarPermissions() {
        return new ResponseEntity<>(PermissionVO.listarPermissions(), HttpStatus.OK);
    }

}


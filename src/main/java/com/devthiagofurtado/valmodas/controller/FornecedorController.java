package com.devthiagofurtado.valmodas.controller;


import com.devthiagofurtado.valmodas.data.vo.FornecedorVO;
import com.devthiagofurtado.valmodas.data.vo.UsuarioVO;
import com.devthiagofurtado.valmodas.security.AccountCredentialsVO;
import com.devthiagofurtado.valmodas.security.jwt.JwtTokenProvider;
import com.devthiagofurtado.valmodas.service.FornecedorService;
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
import org.springframework.web.bind.annotation.*;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;


@Api(tags = "FornecedorEndPoints")
@RestController
@RequestMapping("/fornecedor")
public class FornecedorController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    FornecedorService fornecedorService;

    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    private PagedResourcesAssembler<FornecedorVO> assembler;

    @ApiOperation(value = "Salva novo fornecedor")
    @PostMapping(value = "/salvar", produces = {"application/json", "application/xml", "application/x-yaml"},
            consumes = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity salvar(@RequestBody FornecedorVO fornecedorVO) {
        String token = HeaderUtil.obterToken();
        String user = tokenProvider.getUsername(token.substring(7, token.length()));

        var fornecedorCreated = fornecedorService.salvar(fornecedorVO, user);
        fornecedorCreated.add(linkTo(methodOn(FornecedorController.class).buscaPorId(fornecedorCreated.getKey())).withSelfRel());
        return new ResponseEntity<>(fornecedorCreated, HttpStatus.CREATED);
    }

    @ApiOperation(value = "Procura um Fornecedor for id")
    @GetMapping(value = "/{id}", produces = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity buscaPorId(@PathVariable(value = "id") Long id) {
        String token = HeaderUtil.obterToken();
        String user = tokenProvider.getUsername(token.substring(7, token.length()));

        return new ResponseEntity<>(fornecedorService.buscarPorId(id, user), HttpStatus.OK);
    }

    @ApiOperation(value = "Busca fornecedores por nome ou parte do nome.")
    @GetMapping(value = {"/findAllByFornecedorName"}, produces = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity<?> buscarTodosPorFornecedorNome(@RequestParam(value = "page", defaultValue = "0") int page,
                                                       @RequestParam(value = "limit", defaultValue = "12") int limit,
                                                       @RequestParam(value = "direction", defaultValue = "ASC") String direction,
                                                       @RequestParam(value = "nomeFornecedor", defaultValue = "") String nomeFornecedor

    ) {
        String token = HeaderUtil.obterToken();
        String user = tokenProvider.getUsername(token.substring(7, token.length()));
        var sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, limit, Sort.by(sortDirection, "nomeFornecedor"));
        Page<FornecedorVO> fornecedorVOS = fornecedorService.buscarPorNomeOuParteDoNome(nomeFornecedor, pageable, user);
        fornecedorVOS.forEach(p ->
                p.add(linkTo(methodOn(FornecedorController.class).buscaPorId(p.getKey())).withSelfRel())
        );
        return new ResponseEntity<>(assembler.toResource(fornecedorVOS), HttpStatus.OK);
    }

}


package com.devthiagofurtado.valmodas.controller;


import com.devthiagofurtado.valmodas.data.vo.ClienteVO;
import com.devthiagofurtado.valmodas.security.jwt.JwtTokenProvider;
import com.devthiagofurtado.valmodas.service.ClienteService;
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


@Api(tags = "ClienteEndPoints")
@RestController
@RequestMapping("/cliente")
public class ClienteController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    ClienteService clienteService;

    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    private PagedResourcesAssembler<ClienteVO> assembler;

    @ApiOperation(value = "Salva novo cliente")
    @PostMapping(value = "/salvar", produces = {"application/json", "application/xml", "application/x-yaml"},
            consumes = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity salvar(@RequestBody ClienteVO clienteVO) {
        String token = HeaderUtil.obterToken();
        String user = tokenProvider.getUsername(token.substring(7, token.length()));

        var clienteCreated = clienteService.salvar(clienteVO, user);
        clienteCreated.add(linkTo(methodOn(ClienteController.class).buscaPorId(clienteCreated.getKey())).withSelfRel());
        return new ResponseEntity<>(clienteCreated, HttpStatus.CREATED);
    }

    @ApiOperation(value = "Procura um cliente for id")
    @GetMapping(value = "/{id}", produces = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity buscaPorId(@PathVariable(value = "id") Long id) {
        String token = HeaderUtil.obterToken();
        String user = tokenProvider.getUsername(token.substring(7, token.length()));

        return new ResponseEntity<>(clienteService.buscarPorId(id, user), HttpStatus.OK);
    }

    @ApiOperation(value = "Procura um cliente detalhado por id")
    @GetMapping(value = "/detalhado/{id}", produces = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity buscaDetalhadoPorId(@PathVariable(value = "id") Long id) {
        String token = HeaderUtil.obterToken();
        String user = tokenProvider.getUsername(token.substring(7, token.length()));

        return new ResponseEntity<>(clienteService.buscarDetalhadoPorId(id, user), HttpStatus.OK);
    }

    @ApiOperation(value = "Busca fornecedores por nome ou parte do nome.")
    @GetMapping(value = {"/findAllByClienteName"}, produces = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity<?> buscarTodosPorFornecedorNome(@RequestParam(value = "page", defaultValue = "0") int page,
                                                          @RequestParam(value = "limit", defaultValue = "12") int limit,
                                                          @RequestParam(value = "direction", defaultValue = "ASC") String direction,
                                                          @RequestParam(value = "nomeCliente", defaultValue = "") String nomeCliente

    ) {
        String token = HeaderUtil.obterToken();
        String user = tokenProvider.getUsername(token.substring(7, token.length()));
        var sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, limit, Sort.by(sortDirection, "nomeCliente"));
        Page<ClienteVO> clienteVOS = clienteService.buscarPorNomeOuParteDoNome(nomeCliente, pageable, user);
        clienteVOS.forEach(p ->
                p.add(linkTo(methodOn(ClienteController.class).buscaPorId(p.getKey())).withSelfRel())
        );
        return new ResponseEntity<>(assembler.toResource(clienteVOS), HttpStatus.OK);
    }

}


package com.devthiagofurtado.valmodas.controller;


import com.devthiagofurtado.valmodas.data.vo.VendaVO;
import com.devthiagofurtado.valmodas.security.jwt.JwtTokenProvider;
import com.devthiagofurtado.valmodas.service.VendaService;
import com.devthiagofurtado.valmodas.util.HeaderUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;


@Api(tags = "VendaEndPoints")
@RestController
@RequestMapping("/venda")
public class VendaController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    VendaService vendaService;

    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    private PagedResourcesAssembler<VendaVO> assembler;

    @ApiOperation(value = "Salva nova venda")
    @PostMapping(value = "/salvar", produces = {"application/json", "application/xml", "application/x-yaml"},
            consumes = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity salvar(@RequestBody VendaVO vendaVo) {
        String token = HeaderUtil.obterToken();
        String user = tokenProvider.getUsername(token.substring(7, token.length()));

        var vendaCreated = vendaService.salvar(vendaVo, user);
        vendaCreated.add(linkTo(methodOn(VendaController.class).buscaPorId(vendaCreated.getKey())).withSelfRel());
        return new ResponseEntity<>(vendaCreated, HttpStatus.CREATED);
    }

    @ApiOperation(value = "Procura uma venda por id")
    @GetMapping(value = "/{id}", produces = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity buscaPorId(@PathVariable(value = "id") Long id) {
        String token = HeaderUtil.obterToken();
        String user = tokenProvider.getUsername(token.substring(7, token.length()));

        return new ResponseEntity<>(vendaService.buscarPorId(id, user), HttpStatus.OK);
    }
/*
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
                p.add(linkTo(methodOn(VendaController.class).buscaPorId(p.getKey())).withSelfRel())
        );
        return new ResponseEntity<>(assembler.toResource(clienteVOS), HttpStatus.OK);
    }
*/
}


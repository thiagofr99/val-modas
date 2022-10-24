package com.devthiagofurtado.valmodas.controller;


import com.devthiagofurtado.valmodas.data.vo.DevolucaoVO;
import com.devthiagofurtado.valmodas.data.vo.VendaVO;
import com.devthiagofurtado.valmodas.security.jwt.JwtTokenProvider;
import com.devthiagofurtado.valmodas.service.DevolucaoService;
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


@Api(tags = "DevolucaoEndPoints")
@RestController
@RequestMapping("/devolucao")
public class DevolucaoController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    DevolucaoService devolucaoService;

    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    private PagedResourcesAssembler<VendaVO> assembler;

    @ApiOperation(value = "Salva nova Devolucao")
    @PostMapping(value = "/salvar", produces = {"application/json", "application/xml", "application/x-yaml"},
            consumes = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity salvar(@RequestBody DevolucaoVO devolucaoVO) {
        String token = HeaderUtil.obterToken();
        String user = tokenProvider.getUsername(token.substring(7, token.length()));

        var devCreated = devolucaoService.salvar(devolucaoVO, user);
        devCreated.add(linkTo(methodOn(DevolucaoController.class).buscaPorId(devCreated.getKey())).withSelfRel());
        return new ResponseEntity<>(devCreated, HttpStatus.CREATED);
    }

    @ApiOperation(value = "Procura uma devolucao por id")
    @GetMapping(value = "/{id}", produces = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity buscaPorId(@PathVariable(value = "id") Long id) {
        String token = HeaderUtil.obterToken();
        String user = tokenProvider.getUsername(token.substring(7, token.length()));

        return new ResponseEntity<>(devolucaoService.buscarPorId(id, user), HttpStatus.OK);
    }


}


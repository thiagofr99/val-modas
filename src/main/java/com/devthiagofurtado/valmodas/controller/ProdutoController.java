package com.devthiagofurtado.valmodas.controller;


import com.devthiagofurtado.valmodas.data.model.Produto;
import com.devthiagofurtado.valmodas.data.vo.FornecedorVO;
import com.devthiagofurtado.valmodas.data.vo.ProdutoVO;
import com.devthiagofurtado.valmodas.security.jwt.JwtTokenProvider;
import com.devthiagofurtado.valmodas.service.FornecedorService;
import com.devthiagofurtado.valmodas.service.ProdutoService;
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


@Api(tags = "ProdutoEndPoints")
@RestController
@RequestMapping("/produto")
public class ProdutoController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    ProdutoService produtoService;

    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    private PagedResourcesAssembler<ProdutoVO> assembler;

    @ApiOperation(value = "Salva novo Produto")
    @PostMapping(value = "/salvar", produces = {"application/json", "application/xml", "application/x-yaml"},
            consumes = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity salvar(@RequestBody ProdutoVO produtoVO) {
        String token = HeaderUtil.obterToken();
        String user = tokenProvider.getUsername(token.substring(7, token.length()));

        var produtoCreated = produtoService.salvar(produtoVO, user);
        produtoCreated.add(linkTo(methodOn(ProdutoController.class).buscaPorId(produtoCreated.getKey())).withSelfRel());
        return new ResponseEntity<>(produtoCreated, HttpStatus.CREATED);
    }

    @ApiOperation(value = "Procura um Produto por id")
    @GetMapping(value = "/{id}", produces = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity buscaPorId(@PathVariable(value = "id") Long id) {
        String token = HeaderUtil.obterToken();
        String user = tokenProvider.getUsername(token.substring(7, token.length()));

        return new ResponseEntity<>(produtoService.buscarPorId(id, user), HttpStatus.OK);
    }

    @ApiOperation(value = "Busca produtos por nome ou parte do nome.")
    @GetMapping(value = {"/findAllByProdutoName"}, produces = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity<?> buscarTodosPorProdutoNome(@RequestParam(value = "page", defaultValue = "0") int page,
                                                       @RequestParam(value = "limit", defaultValue = "12") int limit,
                                                       @RequestParam(value = "direction", defaultValue = "ASC") String direction,
                                                       @RequestParam(value = "nomeProduto", defaultValue = "") String nomeProduto

    ) {
        String token = HeaderUtil.obterToken();
        String user = tokenProvider.getUsername(token.substring(7, token.length()));
        var sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, limit, Sort.by(sortDirection, "nomeProduto"));
        var produtoVOS = produtoService.buscarPorNomeOuParteDoNome(nomeProduto, pageable, user);
        produtoVOS.forEach(p ->
                p.add(linkTo(methodOn(ProdutoController.class).buscaPorId(p.getKey())).withSelfRel())
        );
        return new ResponseEntity<>(assembler.toResource(produtoVOS), HttpStatus.OK);
    }

    @ApiOperation(value = "Busca produtos por nome ou parte do nome.")
    @GetMapping(value = {"/findAllByFornecedor/{id}"}, produces = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity<?> buscarTodosPorFornecedor(@RequestParam(value = "page", defaultValue = "0") int page,
                                                          @RequestParam(value = "limit", defaultValue = "12") int limit,
                                                          @RequestParam(value = "direction", defaultValue = "ASC") String direction,
                                                          @PathVariable(value = "id") Long id

    ) {
        String token = HeaderUtil.obterToken();
        String user = tokenProvider.getUsername(token.substring(7, token.length()));
        var sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, limit, Sort.by(sortDirection, "nomeProduto"));
        var produtoVOS = produtoService.buscarPorFornecedor(id, pageable, user);
        produtoVOS.forEach(p ->
                p.add(linkTo(methodOn(ProdutoController.class).buscaPorId(p.getKey())).withSelfRel())
        );
        return new ResponseEntity<>(assembler.toResource(produtoVOS), HttpStatus.OK);
    }

}


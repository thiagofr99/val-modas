package com.devthiagofurtado.valmodas.modelCreator;

import com.devthiagofurtado.valmodas.data.model.Produto;
import com.devthiagofurtado.valmodas.data.vo.PermissionVO;
import com.devthiagofurtado.valmodas.data.vo.ProdutoVO;
import com.devthiagofurtado.valmodas.data.vo.UsuarioVO;

import java.util.List;

public class ProdutoModelCreator {

    public static Produto cadastrado() {

        return Produto.builder()
                .id(1L)
                .codigoBarra("0112010")
                .nomeProduto("Teste")
                .fornecedor(FornecededorModelCreator.cadastrado())
                .build();
    }

    public static ProdutoVO vo() {
        return ProdutoVO.builder()
                .key(1L)
                .codigoBarra("010101")
                .nomeProduto("teste")
                .fornecedorId(2L)
                .build();

    }


}

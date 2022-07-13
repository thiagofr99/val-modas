package com.devthiagofurtado.valmodas.modelCreator;

import com.devthiagofurtado.valmodas.data.model.Fornecedor;
import com.devthiagofurtado.valmodas.data.model.Produto;
import com.devthiagofurtado.valmodas.data.vo.FornecedorVO;
import com.devthiagofurtado.valmodas.data.vo.PermissionVO;
import com.devthiagofurtado.valmodas.data.vo.UsuarioVO;

import java.util.List;

public class FornecededorModelCreator {

    public static Fornecedor cadastrado() {

        return Fornecedor.builder()
                .id(1L)
                .nomeFornecedor("teste")
                .telefone("8588888888")
                .build();
    }

    public static FornecedorVO vo() {

        return FornecedorVO.builder()
                .key(1L)
                .nomeFornecedor("teste")
                .telefone("8588888888")
                .build();
    }


}

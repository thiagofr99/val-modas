package com.devthiagofurtado.valmodas.modelCreator;

import com.devthiagofurtado.valmodas.data.model.Cliente;
import com.devthiagofurtado.valmodas.data.vo.ClienteVO;

public class ClienteModelCreator {

    public static Cliente cadastrado() {

        return Cliente.builder()
                .id(1L)
                .nomeCliente("teste")
                .telefone("8588888888")
                .build();
    }

    public static ClienteVO vo() {

        return ClienteVO.builder()
                .key(1L)
                .nomeCliente("teste")
                .telefone("8588888888")
                .build();
    }


}

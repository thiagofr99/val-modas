package com.devthiagofurtado.valmodas.data.vo;

import com.devthiagofurtado.valmodas.util.EnumSerializerCustom;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.Objects;

@JsonSerialize(using = EnumSerializerCustom.class)
public enum PermissionVO {

    ADMIN(1, "Administrador do Sistema"),
    MANAGER(2, "Gerente Responsável"),
    COMMON_USER(3, "Usuário Comum");

    private PermissionVO(Integer codigo, String descricao) {
        this.codigo = codigo;
        this.descricao = descricao;
    }

    private Integer codigo;
    private String descricao;

    public Integer getCodigo() {
        return codigo;
    }

    public String getDescricao() {
        return descricao;
    }

    public static PermissionVO retornar(Integer codigo) {
        PermissionVO v = null;
        for (PermissionVO s : PermissionVO.values()) {
            if (Objects.equals(s.getCodigo(), codigo)) {
                v = s;
                break;
            }
        }
        return v;
    }

}

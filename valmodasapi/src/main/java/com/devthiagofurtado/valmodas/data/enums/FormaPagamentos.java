package com.devthiagofurtado.valmodas.data.enums;

import com.devthiagofurtado.valmodas.util.EnumSerializerCustom;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@JsonSerialize(using = EnumSerializerCustom.class)
public enum FormaPagamentos {

    DINHEIRO(1, "Dinheiro"),
    CARTAO_A_PRAZO(2, "Cartão - á prazo"),
    CARTAO_A_VISTA(3, "Cartão - á vista"),
    PROMISSORIA(4,"Promissória");

    private FormaPagamentos(Integer codigo, String descricao) {
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

    public static FormaPagamentos retornar(Integer codigo) {
        FormaPagamentos v = null;
        for (FormaPagamentos s : FormaPagamentos.values()) {
            if (Objects.equals(s.getCodigo(), codigo)) {
                v = s;
                break;
            }
        }
        return v;
    }

    public static List<FormaPagamentos> listarFormasPagamentos() {

        return Arrays.asList(FormaPagamentos.values());
    }

}
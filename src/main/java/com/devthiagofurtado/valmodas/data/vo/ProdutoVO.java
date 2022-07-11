package com.devthiagofurtado.valmodas.data.vo;

import com.devthiagofurtado.valmodas.data.model.Fornecedor;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.github.dozermapper.core.Mapping;
import lombok.*;
import org.springframework.hateoas.ResourceSupport;

import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;
import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProdutoVO extends ResourceSupport implements Serializable {

    private static final long serialVersionUID = 1L;

    @Mapping("id")
    @JsonProperty("id")
    private Long key;

    private String nomeProduto;

    private String codigoBarra;

    private Double valorVenda;

    private Double valorCompra;

    private Long fornecedorId;

    private LocalDateTime cadastradoEm;

    private LocalDateTime atualizadoEm;

    private String responsavelCadastro;

    private String responsavelAtualizacao;
}

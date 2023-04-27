package com.devthiagofurtado.valmodas.data.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.github.dozermapper.core.Mapping;
import lombok.*;
import org.springframework.hateoas.ResourceSupport;

import java.io.Serializable;
import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EnderecoVO extends ResourceSupport implements Serializable {

    private static final long serialVersionUID = 1L;

    @Mapping("id")
    @JsonProperty("id")
    private Long key;

    private String nomeRua;

    private String numero;

    private String bairro;

    private String cep;

    private String complemento;

    private LocalDateTime cadastradoEm;

    private LocalDateTime atualizadoEm;

    private String responsavelCadastro;

    private String responsavelAtualizacao;
}

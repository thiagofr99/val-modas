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
public class ClienteVO extends ResourceSupport implements Serializable {

    private static final long serialVersionUID = 1L;

    @Mapping("id")
    @JsonProperty("id")
    private Long key;

    private String nomeCliente;

    private String telefone;

    private LocalDateTime cadastradoEm;

    private LocalDateTime atualizadoEm;

    private String responsavelCadastro;

    private String responsavelAtualizacao;
}

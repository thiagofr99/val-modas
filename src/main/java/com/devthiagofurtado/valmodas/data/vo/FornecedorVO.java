package com.devthiagofurtado.valmodas.data.vo;

import com.devthiagofurtado.valmodas.data.model.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.github.dozermapper.core.Mapping;
import lombok.*;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;
import org.springframework.hateoas.ResourceSupport;

import javax.persistence.Column;
import javax.persistence.Convert;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FornecedorVO extends ResourceSupport implements Serializable {

    private static final long serialVersionUID = 1L;

    @Mapping("id")
    @JsonProperty("id")
    private Long key;

    private String nomeFornecedor;

    private String telefone;

    private LocalDateTime cadastradoEm;

    private LocalDateTime atualizadoEm;

    private String responsavelCadastro;

    private String responsavelAtualizacao;
}

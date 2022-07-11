package com.devthiagofurtado.valmodas.data.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.MappedSuperclass;
import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@SuppressWarnings("serial")
@MappedSuperclass
@SuperBuilder
public abstract class AbstractEntity implements Serializable {


    @Column(name = "DT_CADASTRO")
    private LocalDateTime cadastradoEm;

    @Column(name = "DT_ATUALIZACAO")
    @Convert(converter = Jsr310JpaConverters.LocalDateTimeConverter.class)
    private LocalDateTime atualizadoEm;

    @Column(name = "NU_USUARIO_CADASTRO")
    private String responsavelCadastro;

    @Column(name = "NU_USUARIO_ATUALIZACAO")
    private String responsavelAtualizacao;

    public AbstractEntity(LocalDateTime cadastradoEm, LocalDateTime atualizadoEm, String responsavelCadastro, String responsavelAtualizacao) {
        super();
        this.cadastradoEm = cadastradoEm;
        this.atualizadoEm = atualizadoEm;
        this.responsavelCadastro = responsavelCadastro;
        this.responsavelAtualizacao = responsavelAtualizacao;
    }
}

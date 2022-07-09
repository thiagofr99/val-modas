package com.devthiagofurtado.valmodas.modelCreator.jsonTest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.github.dozermapper.core.Mapping;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UsuarioVOJsonTest {

    @Mapping("id")
    @JsonProperty("id")
    private Long key;

    private String userName;

    private String fullName;

    private String password;

    private Boolean enabled;

    private List<String> permissions;
}

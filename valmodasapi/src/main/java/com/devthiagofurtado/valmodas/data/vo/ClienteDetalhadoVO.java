package com.devthiagofurtado.valmodas.data.vo;

import lombok.*;
import org.springframework.hateoas.ResourceSupport;

import java.io.Serializable;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClienteDetalhadoVO extends ResourceSupport implements Serializable {

    private static final long serialVersionUID = 1L;

    private ClienteVO clienteVO;

    private List<VendaVO> vendaVOS;
}

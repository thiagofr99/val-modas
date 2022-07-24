package com.devthiagofurtado.valmodas.data.model;

import com.devthiagofurtado.valmodas.data.enums.FormaPagamentos;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pagamento")
public class Pagamento extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "forma_pagamento")
    @Enumerated(EnumType.STRING)
    private FormaPagamentos formaPagamentos;

    @Column(name = "valor_pagamento")
    private Double valorPagamento;

    @Column(name = "numero_parcelas")
    private int numeroParcelas;

    @ManyToOne
    @JoinColumn(name = "venda_id")
    private Venda venda;

}

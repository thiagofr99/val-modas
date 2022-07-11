package com.devthiagofurtado.valmodas.data.model;

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
@Table(name = "produto")
public class Produto extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nome_produto")
    private String nomeProduto;

    @Column(name = "codigo_barra")
    private String codigoBarra;

    @Column(name = "valor_venda")
    private Double valorVenda;

    @Column(name = "valor_compra")
    private Double valorCompra;

    @ManyToOne
    @JoinColumn(name = "fornecedor_id")
    private Fornecedor fornecedor;
}

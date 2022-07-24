package com.devthiagofurtado.valmodas.repository;

import com.devthiagofurtado.valmodas.data.model.Fornecedor;
import com.devthiagofurtado.valmodas.data.model.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    @Query("SELECT p FROM Produto p WHERE p.nomeProduto LIKE CONCAT('%',:nome,'%') AND p.estoque = true")
    Page<Produto> findAllByProdutoName(String nome, Pageable pageable);


    @Query("SELECT p FROM Produto p WHERE p.fornecedor =:fornecedor")
    Page<Produto> findAllByFornecedor(Fornecedor fornecedor, Pageable pageable);

}

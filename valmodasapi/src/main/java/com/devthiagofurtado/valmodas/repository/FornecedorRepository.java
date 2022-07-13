package com.devthiagofurtado.valmodas.repository;

import com.devthiagofurtado.valmodas.data.model.Fornecedor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {

    @Query("SELECT f FROM Fornecedor f WHERE f.nomeFornecedor LIKE CONCAT('%',:nome,'%')")
    Page<Fornecedor> findAllByFornecedorName(String nome, Pageable pageable);


}

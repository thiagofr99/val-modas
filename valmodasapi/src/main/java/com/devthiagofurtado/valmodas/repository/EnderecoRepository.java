package com.devthiagofurtado.valmodas.repository;

import com.devthiagofurtado.valmodas.data.model.Endereco;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EnderecoRepository extends JpaRepository<Endereco, Long> {

    @Query("SELECT c FROM Endereco c WHERE c.nomeRua LIKE CONCAT('%',:nome,'%')")
    Page<Endereco> findAllByEnderecoName(String nome, Pageable pageable);


}

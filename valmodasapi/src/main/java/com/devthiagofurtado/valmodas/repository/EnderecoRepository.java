package com.devthiagofurtado.valmodas.repository;

import com.devthiagofurtado.valmodas.data.model.Cliente;
import com.devthiagofurtado.valmodas.data.model.Endereco;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnderecoRepository extends JpaRepository<Endereco, Long> {

    @Query("SELECT c FROM Endereco c WHERE c.nomeRua LIKE CONCAT('%',:nome,'%')")
    Page<Endereco> findAllByEnderecoName(String nome, Pageable pageable);

    @Query("SELECT e FROM Endereco e WHERE e.cliente = :cliente ORDER BY e.id DESC")
    List<Endereco> findByIdCliente(Cliente cliente);
}

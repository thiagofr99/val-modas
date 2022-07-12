package com.devthiagofurtado.valmodas.repository;

import com.devthiagofurtado.valmodas.data.model.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    @Query("SELECT c FROM Cliente c WHERE c.nomeCliente LIKE CONCAT('%',:nome,'%')")
    Page<Cliente> findAllByClienteName(String nome, Pageable pageable);


}

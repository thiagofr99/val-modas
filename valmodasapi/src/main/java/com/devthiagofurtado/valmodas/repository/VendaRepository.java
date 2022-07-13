package com.devthiagofurtado.valmodas.repository;

import com.devthiagofurtado.valmodas.data.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {

//    @Query("SELECT c FROM Cliente c WHERE c.nomeCliente LIKE CONCAT('%',:nome,'%')")
//    Page<Cliente> findAllByClienteName(String nome, Pageable pageable);


}

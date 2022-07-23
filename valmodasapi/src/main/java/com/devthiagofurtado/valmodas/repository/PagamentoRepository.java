package com.devthiagofurtado.valmodas.repository;

import com.devthiagofurtado.valmodas.data.model.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {

//    @Query("SELECT c FROM Cliente c WHERE c.nomeCliente LIKE CONCAT('%',:nome,'%')")
//    Page<Cliente> findAllByClienteName(String nome, Pageable pageable);


}

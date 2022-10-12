package com.devthiagofurtado.valmodas.repository;

import com.devthiagofurtado.valmodas.data.model.Pagamento;
import com.devthiagofurtado.valmodas.data.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {

    @Query("SELECT p FROM Pagamento p WHERE p.venda =:venda")
    List<Pagamento> findAllByVenda(Venda venda);


}

package com.devthiagofurtado.valmodas.repository;

import com.devthiagofurtado.valmodas.data.model.Cliente;
import com.devthiagofurtado.valmodas.data.model.Devolucao;
import com.devthiagofurtado.valmodas.data.model.Venda;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DevolucaoRepository extends JpaRepository<Devolucao, Long> {

    @Query("SELECT d FROM Devolucao d WHERE d.venda.cliente = :cliente ")
    List<Devolucao> findAllByCliente(Cliente cliente);

    @Query("SELECT d FROM Devolucao d WHERE d.venda.cliente = :cliente ")
    Page<Devolucao> findAllByClientePageable(Cliente cliente, Pageable pageable);

    @Query("SELECT d FROM Devolucao d WHERE d.venda = :venda ")
    List<Devolucao> findAllByVenda(Venda venda);
}

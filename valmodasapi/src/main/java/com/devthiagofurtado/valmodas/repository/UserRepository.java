package com.devthiagofurtado.valmodas.repository;

import com.devthiagofurtado.valmodas.data.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u WHERE u.userName =:userName")
    User findByUsername(@Param("userName") String userName);

    @Query("SELECT u FROM User u WHERE u.userName LIKE CONCAT('%',:userName,'%')")
    Page<User> findAllByUserName(String userName, Pageable pageable);
}

package com.rastreador.backend.repository;

import java.util.List;
import java.util.Optional;

import com.rastreador.backend.enums.UserType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.rastreador.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Page<User> findByManager(User manager, Pageable pageable);

    Page<User> findByUserType(UserType userType, Pageable pageable);
}

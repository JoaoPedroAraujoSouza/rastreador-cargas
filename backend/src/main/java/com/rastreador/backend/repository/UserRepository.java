package com.rastreador.backend.repository;

import java.util.List;
import java.util.Optional;

import com.rastreador.backend.enums.UserType;
import org.springframework.data.jpa.repository.JpaRepository;

import com.rastreador.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    List<User> findByManager(User manager);

    List<User> findByUserType(UserType userType);
}

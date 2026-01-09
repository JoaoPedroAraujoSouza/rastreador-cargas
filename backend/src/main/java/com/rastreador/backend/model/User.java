package com.rastreador.backend.model;

import com.rastreador.backend.enums.UserType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Enumerated(EnumType.STRING)
    private UserType userType;

    //TODO: Encrypt password using BCrypt
    private String password;
}

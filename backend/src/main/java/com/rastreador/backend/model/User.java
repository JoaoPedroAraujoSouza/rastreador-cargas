package com.rastreador.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.rastreador.backend.enums.UserType;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType userType;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false, unique = true)
    private String document;

    @Column(name = "full_name",nullable = false)
    private String fullname;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    @JsonIgnore
    private User manager;
}

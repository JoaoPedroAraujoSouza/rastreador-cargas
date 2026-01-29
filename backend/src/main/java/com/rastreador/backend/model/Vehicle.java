package com.rastreador.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name  = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String licensePlate;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
}

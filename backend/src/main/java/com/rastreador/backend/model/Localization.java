package com.rastreador.backend.model;

import jakarta.persistence.Entity;
import lombok.Data;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Data
@Entity
public class Localization {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double latitude;
    private Double longitude;

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}

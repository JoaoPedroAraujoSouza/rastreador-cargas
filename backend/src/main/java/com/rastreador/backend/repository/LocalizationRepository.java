package com.rastreador.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rastreador.backend.model.Localization;

public interface LocalizationRepository extends JpaRepository<Localization, Long> {
    
    List<Localization> findByUserId(Long userId);
}

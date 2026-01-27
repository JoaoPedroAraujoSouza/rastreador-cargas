package com.rastreador.backend.repository;

import com.rastreador.backend.model.Localization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LocalizationRepository extends JpaRepository<Localization, Long> {
    List<Localization> findByUserId(Long userId);
    Optional<Localization> findTopByUserIdOrderByTimestampDesc(Long userId);
    @Modifying
    @Query("DELETE FROM Localization l WHERE l.timestamp < :cutoffDate")
    void deleteByTimestampBefore(LocalDateTime cutoffDate);
}


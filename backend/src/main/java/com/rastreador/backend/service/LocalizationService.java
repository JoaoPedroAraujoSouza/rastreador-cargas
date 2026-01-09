package com.rastreador.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.rastreador.backend.model.Localization;
import com.rastreador.backend.model.User;
import com.rastreador.backend.repository.LocalizationRepository;
import com.rastreador.backend.repository.UserRepository;

@Service
public class LocalizationService {
    
    private final LocalizationRepository localizationRepository;
    private final UserRepository userRepository;

    public LocalizationService(LocalizationRepository localizationRepository, UserRepository userRepository) {
        this.localizationRepository = localizationRepository;
        this.userRepository = userRepository;
    }

    public Localization saveLocalization(Long userId, Double latitude, Double longitude) {
        User driver = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));

        Localization localization = new Localization();
        localization.setUser(driver);
        localization.setLatitude(latitude);
        localization.setLongitude(longitude);
        localization.setTimestamp(LocalDateTime.now());

        return localizationRepository.save(localization);
    }

    public List<Localization> findHistory(Long userId) {
        return localizationRepository.findByUserId(userId);
    }
}

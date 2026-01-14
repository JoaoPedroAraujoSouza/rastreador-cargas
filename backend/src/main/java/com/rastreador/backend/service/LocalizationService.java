package com.rastreador.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import com.rastreador.backend.dto.LocalizationCreateDTO;
import com.rastreador.backend.dto.LocalizationResponseDTO;
import com.rastreador.backend.exceptions.LocalizationNotFoundException;
import com.rastreador.backend.exceptions.UserNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.rastreador.backend.model.Localization;
import com.rastreador.backend.model.User;
import com.rastreador.backend.repository.LocalizationRepository;
import com.rastreador.backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class LocalizationService {

    private final LocalizationRepository localizationRepository;
    private final UserRepository userRepository;

    @Transactional
    public LocalizationResponseDTO createLocalization(LocalizationCreateDTO dto) {
        User user = userRepository.findById(dto.userId())
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado com id: " + dto.userId()));

        Localization localization = new Localization();
        localization.setLatitude(dto.latitude());
        localization.setLongitude(dto.longitude());
        localization.setTimestamp(LocalDateTime.now());
        localization.setUser(user);

        Localization savedLocalization = localizationRepository.save(localization);
        return LocalizationResponseDTO.fromEntity(savedLocalization);
    }

    public List<LocalizationResponseDTO> getLocalizationsByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("Usuário não encontrado com id: " + userId);
        }
        return localizationRepository.findByUserId(userId).stream()
                .map(LocalizationResponseDTO::fromEntity)
                .toList();
    }

    public LocalizationResponseDTO getLatestLocationByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("Usuário não encontrado com id: " + userId);
        }
        Localization localization = localizationRepository.findTopByUserIdOrderByTimestampDesc(userId)
                .orElseThrow(() -> new LocalizationNotFoundException("Nenhuma localização encontrada para o usuário: " + userId));
        return LocalizationResponseDTO.fromEntity(localization);
    }

    @Transactional
    public void deleteLocalization(Long id) {
        if (!localizationRepository.existsById(id)) {
            throw new LocalizationNotFoundException("Localização não encontrada com id: " + id);
        }
        localizationRepository.deleteById(id);
    }
}

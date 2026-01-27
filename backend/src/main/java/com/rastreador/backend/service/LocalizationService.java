package com.rastreador.backend.service;

import com.rastreador.backend.dto.LocalizationCreateDTO;
import com.rastreador.backend.dto.LocalizationResponseDTO;
import com.rastreador.backend.exceptions.LocalizationNotFoundException;
import com.rastreador.backend.exceptions.UserNotFoundException;
import com.rastreador.backend.model.Localization;
import com.rastreador.backend.model.User;
import com.rastreador.backend.repository.LocalizationRepository;
import com.rastreador.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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

// Se o app mandou a hora, usa. Se não, usa a do servidor.
        if (dto.timestamp() != null) {
            localization.setTimestamp(dto.timestamp());
        } else {
            localization.setTimestamp(LocalDateTime.now());
        }

        localization.setUser(user);

        Localization savedLocalization = localizationRepository.save(localization);
        return LocalizationResponseDTO.fromEntity(savedLocalization);
    }

    public Page<LocalizationResponseDTO> getLocalizationsByUserId(Long userId, Pageable pageable) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("Usuário não encontrado com id: " + userId);
        }
        // Busca a página e converte cada entidade para DTO
        return localizationRepository.findByUserId(userId, pageable)
                .map(LocalizationResponseDTO::fromEntity);
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

    @Transactional
    public int createBatchLocalizations(List<LocalizationCreateDTO> dtos) {
        if (dtos.isEmpty()) return 0;


        Long userId = dtos.get(0).userId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado: " + userId));

        List<Localization> entities = dtos.stream().map(dto -> {
            Localization loc = new Localization();
            loc.setLatitude(dto.latitude());
            loc.setLongitude(dto.longitude());

            loc.setTimestamp(dto.timestamp() != null ? dto.timestamp() : LocalDateTime.now());
            loc.setUser(user);
            return loc;
        }).toList();

        localizationRepository.saveAll(entities);

        if (!entities.isEmpty()) {
            Localization lastLoc = entities.get(entities.size() - 1);
        }

        return entities.size();
    }
}
package com.rastreador.backend.dto;

import java.time.LocalDateTime;

public record LocalizationResponseDTO(
        Long id,
        Double latitude,
        Double longitude,
        Long userId,
        LocalDateTime timestamp,
        String username
) {
    public static LocalizationResponseDTO fromEntity(com.rastreador.backend.model.Localization localization) {
        return new LocalizationResponseDTO(
                localization.getId(),
                localization.getLatitude(),
                localization.getLongitude(),
                localization.getUser().getId(),
                localization.getTimestamp(),
                localization.getUser().getUsername()
        );
    }
}

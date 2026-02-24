package com.rastreador.backend.dto;

import com.rastreador.backend.enums.UserType;

public record RefreshTokenResponseDTO(
        String accessToken,
        String refreshToken,
        String type,
        String username,
        UserType userType,
        Long id
) {
    public RefreshTokenResponseDTO(String accessToken, String refreshToken, String username, UserType userType, Long id) {
        this(accessToken, refreshToken, "Bearer", username, userType, id);
    }
}

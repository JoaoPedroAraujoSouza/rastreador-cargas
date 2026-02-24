package com.rastreador.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenCreateDTO(
        @NotBlank(message = "Refresh token é obrigatório")
        String refreshToken
) {}

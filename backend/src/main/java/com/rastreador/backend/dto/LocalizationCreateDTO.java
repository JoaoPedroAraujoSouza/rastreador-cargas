package com.rastreador.backend.dto;

import jakarta.validation.constraints.NotNull;

public record LocalizationCreateDTO(
        @NotNull(message = "Este campo é obrigatório.")
        Double latitude,

        @NotNull(message = "Este campo é obrigatório.")
        Double longitude,

        @NotNull(message = "Este campo é obrigatório.")
        Long userId


) {
}

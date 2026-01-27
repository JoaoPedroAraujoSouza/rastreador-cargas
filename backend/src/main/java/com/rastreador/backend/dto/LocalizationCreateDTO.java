package com.rastreador.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record LocalizationCreateDTO(
        @NotNull(message = "Este campo é obrigatório.")
        @Min(-90)
        @Max(90)
        Double latitude,

        @NotNull(message = "Este campo é obrigatório.")
        @Max(180)
        @Min(-180)
        Double longitude,

        @NotNull(message = "Este campo é obrigatório.")
        Long userId


) {
}

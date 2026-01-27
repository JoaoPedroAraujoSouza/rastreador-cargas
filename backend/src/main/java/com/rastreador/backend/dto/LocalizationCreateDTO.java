package com.rastreador.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record LocalizationCreateDTO(
        @NotNull(message = "Latitude é obrigatória")
        @Min(-90) @Max(90)
        Double latitude,

        @NotNull(message = "Longitude é obrigatória")
        @Min(-180) @Max(180)
        Double longitude,

        @NotNull(message = "User ID é obrigatório")
        Long userId,

        // Novo campo: Hora exata que o GPS capturou o ponto
        LocalDateTime timestamp
) {}
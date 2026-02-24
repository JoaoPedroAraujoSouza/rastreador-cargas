package com.rastreador.backend.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record VehicleUpdateDTO(
        String name,

        @Size(min = 7, max = 8)
        @Pattern(regexp = "[A-Z]{3}[0-9][0-9A-Z][0-9]{2}")
        String licensePlate
) {}
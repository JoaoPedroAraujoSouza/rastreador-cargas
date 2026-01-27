package com.rastreador.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record VehicleCreateDTO(
        @NotBlank(message = "O nome/modelo do veículo é obrigatório")
        String name,

        @NotBlank(message = "A placa é obrigatória")
        @Size(min = 7, max = 8, message = "A placa deve ter entre 7 e 8 caracteres")
        @Pattern(regexp = "[A-Z]{3}[0-9][0-9A-Z][0-9]{2}", message = "Formato de placa inválido (Padrão Mercosul ou Antigo)")
        String licensePlate,

        @NotNull(message = "O ID do proprietário é obrigatório")
        Long ownerId
) {}
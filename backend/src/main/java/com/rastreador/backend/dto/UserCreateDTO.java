package com.rastreador.backend.dto;

import com.rastreador.backend.enums.UserType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserCreateDTO(
        @NotBlank(message = "Este campo é obrigatório.")
        @Size(min = 3, max = 100, message = "O nome de usuário deve ter entre 3 e 100 caracteres.")
        String username,

        @NotNull(message = "Este campo é obrigatório.")
        UserType userType,

        @NotBlank(message = "Este campo é obrigatório.")
        //@Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
        String password
) {
}

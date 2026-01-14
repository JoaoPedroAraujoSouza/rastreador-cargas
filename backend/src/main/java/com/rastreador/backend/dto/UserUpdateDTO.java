package com.rastreador.backend.dto;

import com.rastreador.backend.enums.UserType;
import jakarta.validation.constraints.Size;

public record UserUpdateDTO(
        @Size(min = 3, max = 100, message = "O nome de usuário deve ter entre 3 e 100 caracteres.")
        String username,

        UserType userType,

        //@Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
        String password
) {
}

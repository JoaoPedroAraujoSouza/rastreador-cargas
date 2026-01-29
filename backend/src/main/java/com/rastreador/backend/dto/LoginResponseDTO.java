package com.rastreador.backend.dto;

import com.rastreador.backend.enums.UserType;

public record LoginResponseDTO (
    String token,
    String type,
    String username,
    UserType userType
    ) {
        public LoginResponseDTO(String token, String username, UserType userType) {
            this(token, "Bearer", username, userType);
        }
    }

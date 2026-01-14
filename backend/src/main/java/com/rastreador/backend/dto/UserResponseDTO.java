package com.rastreador.backend.dto;

import com.rastreador.backend.enums.UserType;

public record UserResponseDTO(
    Long id,
    String username,
    UserType userType
) {
        public static UserResponseDTO fromEntity(com.rastreador.backend.model.User user) {
            return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getUserType()
            );
        }
    }

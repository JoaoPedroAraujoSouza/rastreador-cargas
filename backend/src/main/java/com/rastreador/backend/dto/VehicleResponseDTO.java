package com.rastreador.backend.dto;

import com.rastreador.backend.model.Vehicle;

public record VehicleResponseDTO(
        Long id,
        String name,
        String licensePlate,
        Long ownerId,
        String ownerUsername
) {
    public static VehicleResponseDTO fromEntity(Vehicle vehicle) {
        return new VehicleResponseDTO(
                vehicle.getId(),
                vehicle.getName(),
                vehicle.getLicensePlate(),
                vehicle.getOwner().getId(),
                vehicle.getOwner().getUsername()
        );
    }
}
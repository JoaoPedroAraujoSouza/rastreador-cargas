package com.rastreador.backend.service;

import com.rastreador.backend.dto.VehicleCreateDTO;
import com.rastreador.backend.dto.VehicleResponseDTO;
import com.rastreador.backend.dto.VehicleUpdateDTO;
import com.rastreador.backend.exceptions.UserNotFoundException;
import com.rastreador.backend.exceptions.VehicleNotFoundException;
import com.rastreador.backend.model.User;
import com.rastreador.backend.model.Vehicle;
import com.rastreador.backend.repository.UserRepository;
import com.rastreador.backend.repository.VehicleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    @Transactional
    public VehicleResponseDTO createVehicle(VehicleCreateDTO dto) {
        // Valida se o dono existe
        User owner = userRepository.findById(dto.ownerId())
                .orElseThrow(() -> new UserNotFoundException("Usuário (Dono) não encontrado com id: " + dto.ownerId()));

        // Valida unicidade da placa
        if (vehicleRepository.existsByLicensePlate(dto.licensePlate())) {
            throw new IllegalArgumentException("Já existe um veículo cadastrado com a placa: " + dto.licensePlate());
        }

        Vehicle vehicle = new Vehicle();
        vehicle.setName(dto.name());
        vehicle.setLicensePlate(dto.licensePlate().toUpperCase()); // Força maiúsculas
        vehicle.setOwner(owner);

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return VehicleResponseDTO.fromEntity(savedVehicle);
    }

    public List<VehicleResponseDTO> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(VehicleResponseDTO::fromEntity)
                .toList();
    }

    public VehicleResponseDTO getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("Veículo não encontrado com id: " + id));
        return VehicleResponseDTO.fromEntity(vehicle);
    }

    public List<VehicleResponseDTO> getVehiclesByOwnerId(Long ownerId) {
        if (!userRepository.existsById(ownerId)) {
            throw new UserNotFoundException("Usuário não encontrado com id: " + ownerId);
        }
        return vehicleRepository.findByOwnerId(ownerId).stream()
                .map(VehicleResponseDTO::fromEntity)
                .toList();
    }

    @Transactional
    public VehicleResponseDTO updateVehicle(Long id, VehicleUpdateDTO dto) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("Veículo não encontrado com id: " + id));

        if (dto.name() != null && !dto.name().isBlank()) {
            vehicle.setName(dto.name());
        }

        if (dto.licensePlate() != null && !dto.licensePlate().isBlank()) {
            String newPlate = dto.licensePlate().toUpperCase();
            // Se a placa mudou, verifica se a nova já existe em OUTRO carro
            if (!newPlate.equals(vehicle.getLicensePlate()) && vehicleRepository.existsByLicensePlate(newPlate)) {
                throw new IllegalArgumentException("A placa " + newPlate + " já está em uso por outro veículo.");
            }
            vehicle.setLicensePlate(newPlate);
        }

        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return VehicleResponseDTO.fromEntity(updatedVehicle);
    }

    @Transactional
    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new VehicleNotFoundException("Veículo não encontrado com id: " + id);
        }
        vehicleRepository.deleteById(id);
    }

    public List<VehicleResponseDTO> getVehiclesByLicensePlate(String licensePlate) {
        return vehicleRepository.findByLicensePlate(licensePlate.toUpperCase()).stream()
                .map(VehicleResponseDTO::fromEntity)
                .toList();
    }
}
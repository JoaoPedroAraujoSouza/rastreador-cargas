package com.rastreador.backend.controller;

import com.rastreador.backend.dto.VehicleCreateDTO;
import com.rastreador.backend.dto.VehicleResponseDTO;
import com.rastreador.backend.dto.VehicleUpdateDTO;
import com.rastreador.backend.service.VehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Vehicle Controller", description = "Endpoints para gerenciamento de veículos")
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    @Operation(summary = "Cadastrar Veículo", description = "Registra um novo veículo associado a um usuário")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Veículo criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou placa duplicada"),
            @ApiResponse(responseCode = "404", description = "Usuário (dono) não encontrado")
    })
    public ResponseEntity<VehicleResponseDTO> createVehicle(@Valid @RequestBody VehicleCreateDTO dto) {
        log.info("Recebida solicitação para criar veículo placa: {}", dto.licensePlate());
        VehicleResponseDTO createdVehicle = vehicleService.createVehicle(dto);
        return ResponseEntity.status(201).body(createdVehicle);
    }

    @GetMapping
    @Operation(summary = "Listar todos os veículos", description = "Retorna uma lista de todos os veículos cadastrados no sistema")
    public ResponseEntity<List<VehicleResponseDTO>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar veículo por ID", description = "Retorna os detalhes de um veículo específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Veículo encontrado"),
            @ApiResponse(responseCode = "404", description = "Veículo não encontrado")
    })
    public ResponseEntity<VehicleResponseDTO> getVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }

    @GetMapping("/owner/{ownerId}")
    @Operation(summary = "Listar veículos de um usuário", description = "Retorna todos os veículos pertencentes a um ID de usuário")
    public ResponseEntity<List<VehicleResponseDTO>> getVehiclesByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(vehicleService.getVehiclesByOwnerId(ownerId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar veículo", description = "Atualiza nome ou placa de um veículo existente")
    public ResponseEntity<VehicleResponseDTO> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody VehicleUpdateDTO dto) {
        log.info("Atualizando veículo ID: {}", id);
        return ResponseEntity.ok(vehicleService.updateVehicle(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar veículo", description = "Remove um veículo do sistema")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Veículo removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Veículo não encontrado")
    })
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        log.info("Deletando veículo ID: {}", id);
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/license-plate/{licensePlate}")
    @Operation(summary = "Buscar veículo por placa", description = "Retorna os detalhes de um veículo específico pela placa")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Veículo encontrado"),
            @ApiResponse(responseCode = "404", description = "Veículo não encontrado")
    })
    public ResponseEntity<List<VehicleResponseDTO>> getVehicleByLicensePlate(@PathVariable String licensePlate) {
        return ResponseEntity.ok(vehicleService.getVehiclesByLicensePlate(licensePlate));
    }
}
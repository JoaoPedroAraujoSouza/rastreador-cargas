package com.rastreador.backend.controller;

import com.rastreador.backend.dto.LocalizationCreateDTO;
import com.rastreador.backend.dto.LocalizationResponseDTO;
import com.rastreador.backend.service.LocalizationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/localizations")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Localization Controller", description = "Endpoints for managing GPS locations")
public class LocalizationController {

    private final LocalizationService localizationService;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping
    @Operation(summary = "Create new location", description = "Saves a new GPS location from Android app")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Location saved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<LocalizationResponseDTO> createLocalization(@Valid @RequestBody LocalizationCreateDTO dto) {
        log.info("Saving new location for user ID: {}", dto.userId());

        // 1. Salva no banco (seu código atual)
        LocalizationResponseDTO localization = localizationService.createLocalization(dto);

        // 2. Envia para o WebSocket em tempo real
        // O frontend estará inscrito em: /topic/driver/{userId}
        String destination = "/topic/driver/" + dto.userId();
        messagingTemplate.convertAndSend(destination, localization);

        return ResponseEntity.status(201).body(localization);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all locations by user", description = "Retrieves all GPS locations for a specific user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Locations retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<List<LocalizationResponseDTO>> getLocalizationsByUserId(@PathVariable Long userId) {
        log.info("Fetching all locations for user ID: {}", userId);
        List<LocalizationResponseDTO> localizations = localizationService.getLocalizationsByUserId(userId);
        return ResponseEntity.ok(localizations);
    }

    @GetMapping("/user/{userId}/latest")
    @Operation(summary = "Get latest location", description = "Retrieves the most recent GPS location for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Latest location retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "User or location not found")
    })
    public ResponseEntity<LocalizationResponseDTO> getLatestLocationByUserId(@PathVariable Long userId) {
        log.info("Fetching latest location for user ID: {}", userId);
        LocalizationResponseDTO localization = localizationService.getLatestLocationByUserId(userId);
        return ResponseEntity.ok(localization);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete location", description = "Deletes a specific GPS location record")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Location deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Location not found")
    })
    public ResponseEntity<Void> deleteLocalization(@PathVariable Long id) {
        log.info("Deleting location with id: {}", id);
        localizationService.deleteLocalization(id);
        return ResponseEntity.noContent().build();
    }
}

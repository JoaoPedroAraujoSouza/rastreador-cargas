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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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
    @Operation(summary = "Create new location", description = "Saves GPS location and broadcasts it via WebSocket")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Location saved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<LocalizationResponseDTO> createLocalization(@Valid @RequestBody LocalizationCreateDTO dto) {
        log.info("Saving new location for user ID: {}", dto.userId());

        LocalizationResponseDTO localization = localizationService.createLocalization(dto);

        String destination = "/topic/driver/" + dto.userId();
        messagingTemplate.convertAndSend(destination, localization);

        return ResponseEntity.status(201).body(localization);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get location history (Paginated)", description = "Retrieves GPS history paginated. Default: 20 items per page, ordered by newest.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "History retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<Page<LocalizationResponseDTO>> getLocalizationsByUserId(
            @PathVariable Long userId,
            @PageableDefault(size = 20, sort = "timestamp", direction = Sort.Direction.DESC) Pageable pageable) {

        log.info("Fetching paged locations for user ID: {}", userId);
        Page<LocalizationResponseDTO> localizations = localizationService.getLocalizationsByUserId(userId, pageable);
        return ResponseEntity.ok(localizations);
    }

    @GetMapping("/user/{userId}/latest")
    @Operation(summary = "Get latest location", description = "Retrieves the single most recent GPS location")
    public ResponseEntity<LocalizationResponseDTO> getLatestLocationByUserId(@PathVariable Long userId) {
        log.info("Fetching latest location for user ID: {}", userId);
        LocalizationResponseDTO localization = localizationService.getLatestLocationByUserId(userId);
        return ResponseEntity.ok(localization);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete location", description = "Deletes a specific GPS location record")
    public ResponseEntity<Void> deleteLocalization(@PathVariable Long id) {
        log.info("Deleting location with id: {}", id);
        localizationService.deleteLocalization(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/batch")
    @Operation(summary = "Batch insert locations", description = "Saves multiple GPS locations at once (useful for offline sync)")
    public ResponseEntity<Integer> createBatchLocalizations(@Valid @RequestBody List<LocalizationCreateDTO> dtos) {
        log.info("Received batch of {} locations", dtos.size());
        int savedCount = localizationService.createBatchLocalizations(dtos);
        return ResponseEntity.status(201).body(savedCount);
    }
}
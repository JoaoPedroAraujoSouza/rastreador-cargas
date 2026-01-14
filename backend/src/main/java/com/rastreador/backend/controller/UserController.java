package com.rastreador.backend.controller;

import com.rastreador.backend.dto.UserCreateDTO;
import com.rastreador.backend.dto.UserResponseDTO;
import com.rastreador.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "User Controller", description = "Endpoints for managing users")
public class UserController {

    private final UserService userService;

    @PostMapping
    @Operation(summary = "Create a new user", description = "Creates a new user in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody UserCreateDTO dto) {
        log.info("Creating new user with username: {}", dto.username());
        UserResponseDTO createdUser = userService.createUser(dto);
        return ResponseEntity.status(201).body(createdUser);
    }

    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieves a list of all users")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of users retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "No users found")
    })
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        log.info("Retrieving all users");
        java.util.List<UserResponseDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/username/{username}")
    @Operation(summary = "Get user by username", description = "Retrieves a user by their username")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<UserResponseDTO> getUserByUsername(@RequestParam String username) {
        log.info("Retrieving user with username: {}", username);
        UserResponseDTO user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user by ID", description = "Deletes a user by their ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "User deleted successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        log.info("Deleting user with ID: {}", id);
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieves a user by their ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        log.info("Retrieving user with ID: {}", id);
        UserResponseDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
}

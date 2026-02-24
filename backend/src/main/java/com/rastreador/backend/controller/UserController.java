package com.rastreador.backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.rastreador.backend.dto.UserCreateDTO;
import com.rastreador.backend.dto.UserResponseDTO;
import com.rastreador.backend.dto.UserUpdateDTO;
import com.rastreador.backend.service.UserService;
import com.rastreador.backend.util.InputSanitizer;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "User Controller", description = "Endpoints for managing users")
public class UserController {

    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Create a new user")
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody UserCreateDTO dto) {

        String safeUsername = InputSanitizer.sanitize(dto.username());
        String safeFullname = InputSanitizer.sanitize(dto.fullname());

        UserCreateDTO safeDto = new UserCreateDTO(
                safeUsername,
                dto.userType(),
                dto.password(),
                dto.email(),
                dto.document(),
                safeFullname
        );

        UserResponseDTO createdUser = userService.createUser(safeDto);
        return ResponseEntity.status(201).body(createdUser);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Get users (paginated)")
    public ResponseEntity<Page<UserResponseDTO>> getUsers(
            @Parameter(hidden = true)
            @PageableDefault(size = 10, page = 0, sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getName();
        log.info("Listing users (page {}) for: {}", pageable.getPageNumber(), currentUsername);
        Page<UserResponseDTO> users = userService.listUsersByContext(currentUsername, pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{managerId}/drivers")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get drivers by manager ID (Super Admin only)")
    public ResponseEntity<List<UserResponseDTO>> getDriversByManager(@PathVariable Long managerId) {
        return ResponseEntity.ok(userService.getDriversByManagerId(managerId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id, @RequestBody UserUpdateDTO dto) {
        String safeUsername = dto.username() != null ? InputSanitizer.sanitize(dto.username()) : null;
        String safeFullname = dto.fullname() != null ? InputSanitizer.sanitize(dto.fullname()) : null;

        UserUpdateDTO safeDto = new UserUpdateDTO(
                safeUsername,
                dto.userType(),
                dto.password(),
                dto.email(),
                dto.document(),
                safeFullname
        );

        return ResponseEntity.ok(userService.updateUser(id, safeDto));
    }

    @GetMapping("/username/{username}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<UserResponseDTO> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }
}
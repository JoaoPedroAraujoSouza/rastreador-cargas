package com.rastreador.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rastreador.backend.dto.LoginRequestDTO;
import com.rastreador.backend.service.AuthService;
import org.springframework.web.bind.annotation.RequestBody;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.Valid;
import com.rastreador.backend.dto.LoginResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Endpoints de autenticação")
public class AuthController {
    
    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Autentica usuário e retorna um token JWT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login bem-sucedido"),
            @ApiResponse(responseCode = "401", description = "Credenciais inválidas")
    })
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        log.info("POST /api/auth/login - {}", request.username());
        LoginResponseDTO response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}

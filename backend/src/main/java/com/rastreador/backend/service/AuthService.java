package com.rastreador.backend.service;

import com.rastreador.backend.dto.LoginRequestDTO;
import com.rastreador.backend.dto.LoginResponseDTO;
import com.rastreador.backend.dto.UserCreateDTO;
import com.rastreador.backend.enums.UserType;
import com.rastreador.backend.model.User;
import com.rastreador.backend.repository.UserRepository;
import com.rastreador.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new BadCredentialsException("Usuário não encontrado"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Senha inválida");
        }

        String token = jwtUtil.generateToken(user.getUsername());
        return new LoginResponseDTO(token, user.getUsername(), user.getUserType(), user.getId());
    }

    public LoginResponseDTO register(UserCreateDTO request) {
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new IllegalArgumentException("Usuário já existe");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getName();

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Usuário logado não encontrado"));

        UserType newRole = request.userType();

        // Regras de Negócio
        if (currentUser.getUserType() == UserType.ADMIN) {
            if (newRole != UserType.DRIVER) {
                throw new SecurityException("Transportadoras só podem cadastrar Motoristas.");
            }
        }
        if (currentUser.getUserType() == UserType.DRIVER) {
            throw new SecurityException("Motoristas não podem cadastrar usuários.");
        }

        User newUser = new User();
        newUser.setUsername(request.username());
        newUser.setFullname(request.fullname());
        newUser.setPassword(passwordEncoder.encode(request.password()));
        newUser.setUserType(newRole);
        newUser.setEmail(request.email());
        newUser.setDocument(request.document());

        // --- VÍNCULO DE HIERARQUIA ---
        // Se quem cria é ADMIN, ele é o gerente do novo usuário
        if (currentUser.getUserType() == UserType.ADMIN) {
            newUser.setManager(currentUser);
        }

        userRepository.save(newUser);

        String token = jwtUtil.generateToken(newUser.getUsername());
        return new LoginResponseDTO(token, newUser.getUsername(), newUser.getUserType(), newUser.getId());
    }
}
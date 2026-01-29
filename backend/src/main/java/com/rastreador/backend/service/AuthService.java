package com.rastreador.backend.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rastreador.backend.dto.LoginRequestDTO;
import com.rastreador.backend.dto.LoginResponseDTO;
import com.rastreador.backend.dto.UserCreateDTO;
import com.rastreador.backend.model.User;
import com.rastreador.backend.repository.UserRepository;
import com.rastreador.backend.security.JwtUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponseDTO login(LoginRequestDTO request) {
        log.info("Tentativa de login: {}", request.username());

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new BadCredentialsException("Usuário ou senha inválidos"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            log.warn("Senha incorreta para: {}", request.username());
            throw new BadCredentialsException("Usuário ou senha inválidos");
        }

        String token = jwtUtil.generateToken(user.getUsername());

        log.info("Login bem-sucedido para: {}", request.username());

        return new LoginResponseDTO(token, user.getUsername(), user.getUserType());
    }
    
    public LoginResponseDTO register(UserCreateDTO request) {
        log.info("Tentativa de registro: {}", request.username());

        if (userRepository.findByUsername(request.username()).isPresent()) {
            log.warn("Nome de usuário já existe: {}", request.username());
            throw new IllegalArgumentException("Nome de usuário já existe");
        }

        User newUser = new User();
        newUser.setUsername(request.username());
        newUser.setPassword(passwordEncoder.encode(request.password()));
        newUser.setUserType(request.userType());

        userRepository.save(newUser);

        String token = jwtUtil.generateToken(newUser.getUsername());

        log.info("Registro bem-sucedido para: {}", request.username());

        return new LoginResponseDTO(token, newUser.getUsername(), newUser.getUserType());
    }
}

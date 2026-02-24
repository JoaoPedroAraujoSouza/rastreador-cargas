package com.rastreador.backend.service;

import com.rastreador.backend.dto.RefreshTokenCreateDTO;
import com.rastreador.backend.dto.RefreshTokenResponseDTO;
import com.rastreador.backend.exceptions.TokenRefreshException;
import com.rastreador.backend.model.RefreshToken;
import com.rastreador.backend.model.User;
import com.rastreador.backend.repository.RefreshTokenRepository;
import com.rastreador.backend.repository.UserRepository;
import com.rastreador.backend.util.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Value("${jwt.refresh-expiration:604800000}")
    private Long refreshTokenDurationMs;

    @Transactional
    public RefreshToken createRefreshToken(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Remove tokens antigos do usuário
        refreshTokenRepository.deleteByUserId(userId);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException("Refresh token expirado. Faça login novamente.");
        }
        return token;
    }

    @Transactional
    public RefreshTokenResponseDTO refreshAccessToken(RefreshTokenCreateDTO request) {
        log.info("Processando refresh token");

        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.refreshToken())
                .orElseThrow(() -> new TokenRefreshException("Refresh token inválido"));

        refreshToken = verifyExpiration(refreshToken);

        User user = refreshToken.getUser();
        String newAccessToken = jwtUtil.generateToken(user.getUsername());

        return new RefreshTokenResponseDTO(
                newAccessToken,
                refreshToken.getToken(),
                user.getUsername(),
                user.getUserType(),
                user.getId()
        );
    }

    @Transactional
    public void deleteByUserId(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

    @Transactional
    public void cleanupExpiredTokens() {
        log.info("Limpando refresh tokens expirados...");
        refreshTokenRepository.deleteByExpiryDateBefore(Instant.now());
        log.info("Limpeza de tokens concluída.");
    }
}

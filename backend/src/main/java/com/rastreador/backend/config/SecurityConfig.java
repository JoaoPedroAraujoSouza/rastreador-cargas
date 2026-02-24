package com.rastreador.backend.config;

import com.rastreador.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Habilita @PreAuthorize nos controllers
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Rotas públicas
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/ws-tracker/**").permitAll()
                        .requestMatchers("/actuator/health").permitAll()

                        // Registro requer autenticação
                        .requestMatchers("/api/auth/register").authenticated()

                        // SUPER_ADMIN pode tudo
                        .requestMatchers("/api/users/**").hasAnyRole("SUPER_ADMIN", "ADMIN")

                        // Apenas ADMIN e SUPER_ADMIN gerenciam veículos
                        .requestMatchers(HttpMethod.POST, "/api/vehicles/**").hasAnyRole("SUPER_ADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/vehicles/**").hasAnyRole("SUPER_ADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/vehicles/**").hasAnyRole("SUPER_ADMIN", "ADMIN")

                        // DRIVER pode enviar localização
                        .requestMatchers(HttpMethod.POST, "/api/localizations/**").hasAnyRole("DRIVER", "ADMIN", "SUPER_ADMIN")

                        // Leitura de localizações para ADMIN e SUPER_ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/localizations/**").hasAnyRole("ADMIN", "SUPER_ADMIN")

                        // Todo o resto precisa estar autenticado
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

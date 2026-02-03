package com.rastreador.backend.config;

import com.rastreador.backend.security.SecurityHeadersFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SecurityHeadersConfig {

    @Bean
    public org.springframework.boot.web.servlet.FilterRegistrationBean<SecurityHeadersFilter> securityHeadersFilter() {
        var registration = new org.springframework.boot.web.servlet.FilterRegistrationBean<SecurityHeadersFilter>();

        // Registra o filtro customizado que definimos anteriormente
        registration.setFilter(new SecurityHeadersFilter());

        // Aplica a todas as rotas
        registration.addUrlPatterns("/*");
        return registration;
    }
}
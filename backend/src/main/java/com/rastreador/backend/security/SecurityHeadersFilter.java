package com.rastreador.backend.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public class SecurityHeadersFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Proteção contra Sniffing de Mime-Type
        httpResponse.setHeader("X-Content-Type-Options", "nosniff");

        // Evita que seu site seja colocado em um iFrame (Clickjacking)
        httpResponse.setHeader("X-Frame-Options", "DENY");

        // Filtro de XSS do navegador
        httpResponse.setHeader("X-XSS-Protection", "1; mode=block");

        // Força HTTPS (HSTS) - Importante para produção
        httpResponse.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

        // --- CONTENT SECURITY POLICY (CSP) AJUSTADA PARA REACT ---
        // Permite:
        // - 'self': Recursos do próprio domínio
        // - 'unsafe-inline': Necessário para estilos do React e Styled-Components
        // - https://fonts.googleapis.com: Fontes do Google
        // - ws: e wss: Permite conexões WebSocket (Rastreamento em tempo real)
        // - data: Permite imagens em base64 (avatares, ícones)
        String cspPolicy = "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                "font-src 'self' https://fonts.gstatic.com data:; " +
                "img-src 'self' data: https:; " +
                "connect-src 'self' ws: wss: https: http:;";

        httpResponse.setHeader("Content-Security-Policy", cspPolicy);

        chain.doFilter(request, response);
    }
}
package com.rastreador.backend.util;

import org.springframework.web.util.HtmlUtils;

public class InputSanitizer {

    public static String sanitize(String input) {
        if (input == null) return null;
        // Escapa caracteres HTML perigosos (ex: <script> vira &lt;script&gt;)
        return HtmlUtils.htmlEscape(input.trim());
    }

    public static String sanitizeForLog(String input) {
        if (input == null) return null;
        // Remove quebras de linha para evitar Log Injection
        return input.replaceAll("[\n\r\t]", "_");
    }
}
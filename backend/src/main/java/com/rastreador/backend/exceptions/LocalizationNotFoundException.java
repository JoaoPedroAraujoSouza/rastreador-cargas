package com.rastreador.backend.exceptions;

public class LocalizationNotFoundException extends RuntimeException {
    public LocalizationNotFoundException(String message) {
        super(message);
    }
}

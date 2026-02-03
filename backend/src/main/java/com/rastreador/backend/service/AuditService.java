package com.rastreador.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AuditService {

    public void logSecurityEvent(String username, String action, String details, String ip) {
        log.warn("SECURITY_AUDIT | User: {} | Action: {} | Details: {} | IP: {}",
                username, action, details, ip);
    }
}

package com.rastreador.backend.job;

import com.rastreador.backend.repository.LocalizationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class LocalizationCleanupJob {

    private final LocalizationRepository localizationRepository;

    private static final int DAYS_TO_KEEP_DATA = 7;


    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void cleanupOldLocalizations() {
        log.info("Iniciando job de limpeza de localizações antigas...");

        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(DAYS_TO_KEEP_DATA);

        try {
            localizationRepository.deleteByTimestampBefore(cutoffDate);
            log.info("Limpeza concluída. Dados anteriores a {} foram removidos.", cutoffDate);
        } catch (Exception e) {
            log.error("Falha ao executar limpeza de localizações", e);
        }
    }
}
package com.rastreador.backend.config;

import com.rastreador.backend.enums.UserType;
import com.rastreador.backend.model.Localization;
import com.rastreador.backend.model.User;
import com.rastreador.backend.model.Vehicle;
import com.rastreador.backend.repository.LocalizationRepository;
import com.rastreador.backend.repository.UserRepository;
import com.rastreador.backend.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final LocalizationRepository localizationRepository; // Repositório de Localização adicionado
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("--- 🚀 INICIANDO SEED DE DADOS ---");

        // 1. Criar Super Admins
        User superAdmin1 = createUserIfNotFound("kelven_admin", "Kélven Alves", "kelven@fleet.com", "000.000.000-01", UserType.SUPER_ADMIN, null);
        User superAdmin2 = createUserIfNotFound("joao_admin", "João Pedro", "joao@fleet.com", "000.000.000-02", UserType.SUPER_ADMIN, null);

        // 2. Criar Transportadora (Admin)
        User transportadora = createUserIfNotFound("transportadora_exemplo", "Logística Express", "contato@log.com", "00.123.456/0001-99", UserType.ADMIN, null);

        // 3. Criar Motorista (Vinculado à Transportadora)
        if (transportadora != null) {
            User motorista = createUserIfNotFound("motorista_jose", "José da Silva", "jose@driver.com", "111.222.333-44", UserType.DRIVER, transportadora);

            // 4. Criar Veículo para o Motorista
            if (motorista != null) {
                createVehicleIfNotFound("Scania R450", "ABC-1234", motorista);

                // 5. Criar Rota de Teste (Localizações) [NOVO]
                createRouteIfEmpty(motorista);
            }
        }

        System.out.println("--- ✅ SEED CONCLUÍDO COM SUCESSO ---");
    }

    private User createUserIfNotFound(String username, String fullname, String email, String doc, UserType type, User manager) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            return userOpt.get();
        }

        User user = new User();
        user.setUsername(username);
        user.setFullname(fullname);
        user.setEmail(email);
        user.setDocument(doc);
        user.setUserType(type);
        user.setManager(manager);
        user.setPassword(passwordEncoder.encode("password"));

        return userRepository.save(user);
    }

    private void createVehicleIfNotFound(String name, String plate, User owner) {
        if (vehicleRepository.findByLicensePlate(plate).isEmpty()) {
            Vehicle v = new Vehicle();
            v.setName(name);
            v.setLicensePlate(plate);
            v.setOwner(owner);
            vehicleRepository.save(v);
        }
    }

    // --- Lógica para criar localizações fictícias ---
    private void createRouteIfEmpty(User user) {
        // Verifica se já existem dados para não duplicar a cada restart
        // (Nota: Se você rodar 'docker-compose down -v', ele cria de novo pois apaga o banco)
        if (localizationRepository.count() > 0) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();

        // Rota simulada: Centro de SP -> Ibirapuera
        // Ponto 1: Praça da Sé (Há 60 min)
        createLocation(-23.550520, -46.633308, now.minusMinutes(60), user);

        // Ponto 2: Av. 23 de Maio (Há 45 min)
        createLocation(-23.559669, -46.639395, now.minusMinutes(45), user);

        // Ponto 3: Paraíso (Há 30 min)
        createLocation(-23.572370, -46.643323, now.minusMinutes(30), user);

        // Ponto 4: Parque Ibirapuera (Há 15 min)
        createLocation(-23.587416, -46.657634, now.minusMinutes(15), user);

        // Ponto 5: Fim da Rota (Agora)
        createLocation(-23.591245, -46.661957, now, user);

        System.out.println("📍 Rota de teste criada para: " + user.getUsername());
    }

    private void createLocation(Double lat, Double lon, LocalDateTime time, User user) {
        Localization loc = new Localization();
        loc.setLatitude(lat);
        loc.setLongitude(lon);
        loc.setTimestamp(time);
        loc.setUser(user);
        localizationRepository.save(loc);
    }
}
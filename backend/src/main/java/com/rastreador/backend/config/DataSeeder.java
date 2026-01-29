package com.rastreador.backend.config;

import com.rastreador.backend.enums.UserType;
import com.rastreador.backend.model.User;
import com.rastreador.backend.model.Vehicle;
import com.rastreador.backend.repository.UserRepository;
import com.rastreador.backend.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository; // Se não tiver repositório de veículo, crie ou ignore esta parte
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("--- 🚀 INICIANDO SEED DE DADOS ---");

        // 1. Criar Super Admin
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
        // AQUI ESTÁ O SEGREDO: O Java gera o hash compatível agora
        user.setPassword(passwordEncoder.encode("password"));

        return userRepository.save(user);
    }

    private void createVehicleIfNotFound(String name, String plate, User owner) {
        // Simples verificação para não duplicar (você precisará ter o VehicleRepository)
        // Se não tiver o repositório pronto, pode comentar este método.
        if (vehicleRepository.findByLicensePlate(plate).isEmpty()) {
            Vehicle v = new Vehicle();
            v.setName(name);
            v.setLicensePlate(plate);
            v.setOwner(owner);
            vehicleRepository.save(v);
        }
    }
}
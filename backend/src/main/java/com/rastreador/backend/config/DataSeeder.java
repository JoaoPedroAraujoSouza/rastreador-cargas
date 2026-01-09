package com.rastreador.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import com.rastreador.backend.enums.UserType;
import com.rastreador.backend.model.User;
import com.rastreador.backend.repository.UserRepository;

@Configuration
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    
    public DataSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        
        if (userRepository.count() == 0) {
            
            User driver = new User();
            driver.setUsername("Seu zé do caminhão");
            driver.setPassword("password");
            driver.setUserType(UserType.DRIVER);
            userRepository.save(driver);

            User admin = new User();
            admin.setUsername("Logistica LTDA");
            admin.setPassword("password");
            admin.setUserType(UserType.ADMIN);
            userRepository.save(admin);

            System.out.println("Seeded initial user data.");
        }
    }
}

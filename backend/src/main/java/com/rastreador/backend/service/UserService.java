package com.rastreador.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rastreador.backend.model.User;
import com.rastreador.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}

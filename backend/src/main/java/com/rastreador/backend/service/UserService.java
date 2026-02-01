package com.rastreador.backend.service;

import java.util.Collections;
import java.util.List;

import com.rastreador.backend.dto.UserCreateDTO;
import com.rastreador.backend.dto.UserResponseDTO;
import com.rastreador.backend.enums.UserType;
import com.rastreador.backend.exceptions.UserNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import com.rastreador.backend.dto.UserUpdateDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rastreador.backend.model.User;
import com.rastreador.backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponseDTO createUser(UserCreateDTO dto) {
        User user = new User();
        user.setUsername(dto.username());
        user.setFullname(dto.fullname());
        user.setUserType(dto.userType());
        user.setEmail(dto.email());
        user.setDocument(dto.document());
        user.setPassword(passwordEncoder.encode(dto.password()));

        User savedUser = userRepository.save(user);
        return UserResponseDTO.fromEntity(savedUser);
    }

    public Page<UserResponseDTO> listUsersByContext(String currentUsername, Pageable pageable) {
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new UserNotFoundException("Usuário atual não encontrado"));

        List<User> users;

        if (currentUser.getUserType() == UserType.SUPER_ADMIN) {
           return userRepository.findByUserType(UserType.ADMIN, pageable)
                   .map(UserResponseDTO::fromEntity);
        }
        else if (currentUser.getUserType() == UserType.ADMIN) {
            return userRepository.findByManager(currentUser, pageable).map(UserResponseDTO::fromEntity);
        }
        else {
            return Page.empty(pageable);
        }
    }

    public List<UserResponseDTO> getDriversByManagerId(Long managerId) {
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new UserNotFoundException("Transportadora não encontrada com ID: " + managerId));

        return userRepository.findByManager(manager, Pageable.unpaged()).getContent()
                .stream()
                .map(UserResponseDTO::fromEntity)
                .toList();
    }

    @Transactional
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponseDTO::fromEntity)
                .toList();
    }

    public UserResponseDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado: " + username));
        return UserResponseDTO.fromEntity(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("Usuário não encontrado com id: " + id);
        }
        userRepository.deleteById(id);
    }

    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado com id: " + id));
        return UserResponseDTO.fromEntity(user);
    }

    @Transactional
    public UserResponseDTO updateUser(Long id, UserUpdateDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));

        if (dto.username() != null) user.setUsername(dto.username());
        if (dto.userType() != null) user.setUserType(dto.userType());
        if (dto.fullname() != null) user.setFullname(dto.fullname());
        if (dto.password() != null) user.setPassword(passwordEncoder.encode(dto.password()));

        User updatedUser = userRepository.save(user);
        return UserResponseDTO.fromEntity(updatedUser);
    }

    public UserResponseDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado com email: " + email));
        return UserResponseDTO.fromEntity(user);
    }
}
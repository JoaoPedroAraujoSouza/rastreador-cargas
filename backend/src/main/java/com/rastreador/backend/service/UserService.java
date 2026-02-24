package com.rastreador.backend.service;

import java.util.List;

import com.rastreador.backend.dto.UserCreateDTO;
import com.rastreador.backend.dto.UserResponseDTO;
import com.rastreador.backend.dto.UserUpdateDTO;
import com.rastreador.backend.enums.UserType;
import com.rastreador.backend.exceptions.UserNotFoundException;
import com.rastreador.backend.model.User;
import com.rastreador.backend.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

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
        user.setActive(true);

        User savedUser = userRepository.save(user);
        return UserResponseDTO.fromEntity(savedUser);
    }

    public Page<UserResponseDTO> listUsersByContext(String currentUsername, Pageable pageable) {
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new UserNotFoundException("Usuário atual não encontrado"));

        if (currentUser.getUserType() == UserType.SUPER_ADMIN) {

            return userRepository.findByUserTypeAndActiveTrue(UserType.ADMIN, pageable)
                    .map(UserResponseDTO::fromEntity);
        }
        else if (currentUser.getUserType() == UserType.ADMIN) {

            return userRepository.findByManagerAndActiveTrue(currentUser, pageable)
                    .map(UserResponseDTO::fromEntity);
        }
        else {
            return Page.empty(pageable);
        }
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado com id: " + id));

        user.setActive(false);
        userRepository.save(user);
    }

    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado com id: " + id));
        return UserResponseDTO.fromEntity(user);
    }

    public List<UserResponseDTO> getDriversByManagerId(Long managerId) {
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new UserNotFoundException("Transportadora não encontrada com ID: " + managerId));

        return userRepository.findByManagerAndActiveTrue(manager, Pageable.unpaged()).getContent()
                .stream()
                .map(UserResponseDTO::fromEntity)
                .toList();
    }

    @Transactional
    public UserResponseDTO updateUser(Long id, UserUpdateDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));

        if (dto.username() != null) user.setUsername(dto.username());
        if (dto.userType() != null) user.setUserType(dto.userType());
        if (dto.fullname() != null) user.setFullname(dto.fullname());
        if (dto.password() != null) user.setPassword(passwordEncoder.encode(dto.password()));
        if (dto.email() != null) user.setEmail(dto.email());
        if (dto.document() != null) user.setDocument(dto.document());

        User updatedUser = userRepository.save(user);
        return UserResponseDTO.fromEntity(updatedUser);
    }

    public UserResponseDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado: " + username));
        return UserResponseDTO.fromEntity(user);
    }

    @Transactional
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(User::getActive)
                .map(UserResponseDTO::fromEntity)
                .toList();
    }

    public UserResponseDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado com email: " + email));
        return UserResponseDTO.fromEntity(user);
    }
}
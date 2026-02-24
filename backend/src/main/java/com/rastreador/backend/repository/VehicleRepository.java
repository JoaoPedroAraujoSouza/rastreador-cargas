package com.rastreador.backend.repository;

import com.rastreador.backend.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByOwnerId(Long ownerId);
    boolean existsByLicensePlate(String licensePlate);
    List<Vehicle> findByLicensePlate(String licensePlate);
}
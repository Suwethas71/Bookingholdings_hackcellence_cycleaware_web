package com.cycleaware.backend.repository;

import com.cycleaware.backend.entity.CycleProfile;
import com.cycleaware.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CycleProfileRepository extends JpaRepository<CycleProfile, Long> {
    Optional<CycleProfile> findByUserId(Long userId);
    Optional<CycleProfile> findByUser(User user);
}


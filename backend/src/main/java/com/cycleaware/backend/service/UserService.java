package com.cycleaware.backend.service;

import com.cycleaware.backend.dto.CycleProfileDTO;
import com.cycleaware.backend.dto.UserResponseDTO;
import com.cycleaware.backend.entity.CycleProfile;
import com.cycleaware.backend.entity.User;
import com.cycleaware.backend.repository.CycleProfileRepository;
import com.cycleaware.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CycleProfileRepository cycleProfileRepository;

    @Transactional(readOnly = true)
    public UserResponseDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return mapToUserResponse(user);
    }

    @Transactional
    public CycleProfileDTO saveOrUpdateCycleProfile(String email, CycleProfileDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Optional<CycleProfile> existingOpt = cycleProfileRepository.findByUser(user);
        CycleProfile profile;

        if (existingOpt.isPresent()) {
            profile = existingOpt.get();
            profile.setLastPeriodDate(dto.getLastPeriodDate());
            profile.setCycleLength(dto.getCycleLength());
            profile.setSymptomSeverity(dto.getSymptomSeverity());
            profile.setPreferredPace(dto.getPreferredPace());
        } else {
            profile = CycleProfile.builder()
                    .user(user)
                    .lastPeriodDate(dto.getLastPeriodDate())
                    .cycleLength(dto.getCycleLength() != null ? dto.getCycleLength() : 28)
                    .symptomSeverity(dto.getSymptomSeverity())
                    .preferredPace(dto.getPreferredPace())
                    .build();
        }

        CycleProfile saved = cycleProfileRepository.save(profile);
        return mapToCycleProfileDTO(saved);
    }

    public UserResponseDTO mapToUserResponse(User user) {
        Optional<CycleProfile> profileOpt = cycleProfileRepository.findByUser(user);
        CycleProfileDTO profileDTO = profileOpt.map(this::mapToCycleProfileDTO).orElse(null);

        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .gender(user.getGender())
                .hasCycleProfile(profileDTO != null)
                .cycleProfile(profileDTO)
                .createdAt(user.getCreatedAt())
                .build();
    }

    public CycleProfileDTO mapToCycleProfileDTO(CycleProfile profile) {
        if (profile == null) return null;
        return CycleProfileDTO.builder()
                .id(profile.getId())
                .lastPeriodDate(profile.getLastPeriodDate())
                .cycleLength(profile.getCycleLength())
                .symptomSeverity(profile.getSymptomSeverity())
                .preferredPace(profile.getPreferredPace())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}


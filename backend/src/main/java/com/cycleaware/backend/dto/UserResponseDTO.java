package com.cycleaware.backend.dto;

import com.cycleaware.backend.enums.Gender;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private Gender gender;
    private Boolean hasCycleProfile;
    private CycleProfileDTO cycleProfile;
    private LocalDateTime createdAt;
}


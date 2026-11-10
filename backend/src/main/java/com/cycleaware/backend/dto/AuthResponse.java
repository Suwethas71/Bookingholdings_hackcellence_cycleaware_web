package com.cycleaware.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private UserResponseDTO user;
}


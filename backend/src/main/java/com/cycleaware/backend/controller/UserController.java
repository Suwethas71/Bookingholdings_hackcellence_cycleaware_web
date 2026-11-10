package com.cycleaware.backend.controller;

import com.cycleaware.backend.dto.CycleProfileDTO;
import com.cycleaware.backend.dto.UserResponseDTO;
import com.cycleaware.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.getCurrentUser(email));
    }

    @PostMapping("/me/cycle-profile")
    public ResponseEntity<CycleProfileDTO> createCycleProfile(
            Authentication authentication,
            @RequestBody CycleProfileDTO cycleProfileDTO) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.saveOrUpdateCycleProfile(email, cycleProfileDTO));
    }

    @PutMapping("/me/cycle-profile")
    public ResponseEntity<CycleProfileDTO> updateCycleProfile(
            Authentication authentication,
            @RequestBody CycleProfileDTO cycleProfileDTO) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.saveOrUpdateCycleProfile(email, cycleProfileDTO));
    }
}


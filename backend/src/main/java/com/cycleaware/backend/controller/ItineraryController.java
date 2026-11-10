package com.cycleaware.backend.controller;

import com.cycleaware.backend.dto.ItineraryRequestDTO;
import com.cycleaware.backend.dto.ItineraryResponseDTO;
import com.cycleaware.backend.service.ItineraryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/itinerary")
@RequiredArgsConstructor
public class ItineraryController {

    private final ItineraryService itineraryService;

    @PostMapping("/generate")
    public ResponseEntity<ItineraryResponseDTO> generateItinerary(
            @Valid @RequestBody ItineraryRequestDTO request,
            Authentication authentication) {

        String userEmail = (authentication != null && authentication.isAuthenticated())
                ? authentication.getName()
                : null;

        ItineraryResponseDTO response = itineraryService.generateItinerary(userEmail, request);
        return ResponseEntity.ok(response);
    }
}


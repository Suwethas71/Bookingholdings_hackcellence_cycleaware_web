package com.cycleaware.backend.controller;

import com.cycleaware.backend.dto.AmenityResponseDTO;
import com.cycleaware.backend.service.GoogleMapsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/amenities")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.OPTIONS})
@RequiredArgsConstructor
public class AmenityController {

    private final GoogleMapsService googleMapsService;

    @GetMapping
    public ResponseEntity<List<AmenityResponseDTO>> getNearbyAmenities(
            @RequestParam(defaultValue = "8.0883") double lat,
            @RequestParam(defaultValue = "77.5385") double lng,
            @RequestParam(defaultValue = "restroom") String type) {
        List<AmenityResponseDTO> amenities = googleMapsService.findNearbyAmenities(lat, lng, type);
        return ResponseEntity.ok(amenities);
    }
}


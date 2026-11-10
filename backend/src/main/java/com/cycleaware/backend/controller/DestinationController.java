package com.cycleaware.backend.controller;

import com.cycleaware.backend.dto.DestinationDTO;
import com.cycleaware.backend.dto.PagedResponseDTO;
import com.cycleaware.backend.service.DestinationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/destinations")
@RequiredArgsConstructor
public class DestinationController {

    private final DestinationService destinationService;

    @GetMapping
    public ResponseEntity<PagedResponseDTO<DestinationDTO>> getDestinations(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double maxEntryFee,
            @RequestParam(required = false, defaultValue = "POPULARITY") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        return ResponseEntity.ok(destinationService.getDestinations(search, category, maxEntryFee, sortBy, page, size));
    }

    @GetMapping("/by-ids")
    public ResponseEntity<List<DestinationDTO>> getByIds(@RequestParam List<Long> ids) {
        return ResponseEntity.ok(destinationService.getDestinationsByIds(ids));
    }
}

package com.cycleaware.backend.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryRequestDTO {

    @NotEmpty(message = "destinationIds cannot be empty")
    private List<Long> destinationIds;

    @NotNull(message = "tripDays is required")
    private Integer tripDays;

    private String tripTitle;
}


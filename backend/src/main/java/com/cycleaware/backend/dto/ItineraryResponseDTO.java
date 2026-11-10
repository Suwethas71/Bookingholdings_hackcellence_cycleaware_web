package com.cycleaware.backend.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryResponseDTO {
    private String tripTitle;
    private Integer totalDays;
    private Integer totalDestinations;
    private Boolean cycleAwarePersonalized;
    private String cycleProfileSummary;
    private List<ItineraryDayDTO> days;
    private String aiProvider;
    private String generatedAt;
}


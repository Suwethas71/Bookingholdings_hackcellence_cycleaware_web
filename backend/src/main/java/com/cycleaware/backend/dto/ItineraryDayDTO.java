package com.cycleaware.backend.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryDayDTO {
    private Integer dayNumber;
    private String title;
    private String theme;
    private String dailyComfortGuidance;
    private List<ItineraryActivityDTO> activities;
}


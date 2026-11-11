package com.cycleaware.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryActivityDTO {
    private String timeSlot; // Morning, Afternoon, Evening, Sunset
    private String timeRange; // e.g. "08:30 AM - 10:30 AM"
    private Long destinationId;
    private String destinationName;
    private String category;
    private String duration;
    private String activityDescription;
    private String comfortNotes; // CycleAware comfort advice
    private String location;
    private Double latitude;
    private Double longitude;
    private Double entryFee;
}


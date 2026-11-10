package com.cycleaware.backend.dto;

import com.cycleaware.backend.enums.DestinationCategory;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DestinationDTO {
    private Long id;
    private String name;
    private String description;
    private DestinationCategory category;
    private String categoryLabel;
    private String estimatedDuration;
    private Double entryFee;
    private String imageUrl;
    private String location;
    private Double latitude;
    private Double longitude;
    private Integer popularityScore;
    private Double distanceFromCoimbatore;
    private String highlights;
    private Boolean isDataVerified;
}

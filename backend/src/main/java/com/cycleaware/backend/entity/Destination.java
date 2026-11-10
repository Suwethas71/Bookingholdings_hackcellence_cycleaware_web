package com.cycleaware.backend.entity;

import com.cycleaware.backend.enums.DestinationCategory;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "destinations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DestinationCategory category;

    private String estimatedDuration; // e.g. "1-2 hours"

    private Double entryFee; // in INR, 0 for free

    private String imageUrl;

    private String location; // city/district name

    private Double latitude;

    private Double longitude;

    private Integer popularityScore; // 1-100

    private Double distanceFromCoimbatore; // in km

    @Column(length = 500)
    private String highlights; // comma-separated highlights

    private Boolean isDataVerified;
}

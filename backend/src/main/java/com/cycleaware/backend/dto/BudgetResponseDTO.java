package com.cycleaware.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetResponseDTO {
    private Double transportationCost;
    private String transportationBreakdown;
    private Double localTransportCost;
    private Double accommodationCost;
    private String accommodationBreakdown;
    private Double foodCost;
    private Double attractionEntryFees;
    private Double miscellaneousCost;
    private Double totalCost;
    private Double perPersonCost;
    private Integer numberOfTravellers;
    private Integer numberOfNights;
    private String travelMode;
    private String travelClass;
    private String accommodationType;
    private String disclaimer;
}

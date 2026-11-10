package com.cycleaware.backend.dto;

import com.cycleaware.backend.enums.TravelMode;
import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetRequestDTO {
    private List<Long> selectedDestinationIds;
    private TravelMode travelMode;
    private String travelClass; // SLEEPER, AC_3T, AC_2T, AC_1T, GENERAL for train; GOVERNMENT, PRIVATE, SLEEPER for bus; OWN_CAR, RENTAL, TAXI for car
    private Integer numberOfTravellers;
    private Integer numberOfNights;
    private String accommodationType; // BUDGET, STANDARD, PREMIUM
    private Double foodBudgetPerPersonPerDay;
    private Double localTransportBudgetPerDay;
    private Double miscellaneousBudget;
}

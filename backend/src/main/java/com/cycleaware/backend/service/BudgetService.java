package com.cycleaware.backend.service;

import com.cycleaware.backend.dto.BudgetRequestDTO;
import com.cycleaware.backend.dto.BudgetResponseDTO;
import com.cycleaware.backend.entity.Destination;
import com.cycleaware.backend.repository.DestinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final DestinationRepository destinationRepository;

    public BudgetResponseDTO calculate(BudgetRequestDTO req) {
        int travellers = req.getNumberOfTravellers() != null ? req.getNumberOfTravellers() : 1;
        int nights = req.getNumberOfNights() != null ? req.getNumberOfNights() : 2;

        // Transportation cost (per person, one way; we calculate round trip)
        double transportPerPerson = calculateTransportCost(req.getTravelMode(), req.getTravelClass());
        double totalTransport = transportPerPerson * travellers * 2; // round trip

        String transportBreakdown = String.format(
            "%s (%s) - \u20b9%.0f/person \u00d7 %d travellers \u00d7 2 (round trip)",
            req.getTravelMode(), req.getTravelClass() != null ? req.getTravelClass() : "Standard",
            transportPerPerson, travellers
        );

        // Local transport
        double localTransportPerDay = req.getLocalTransportBudgetPerDay() != null
                ? req.getLocalTransportBudgetPerDay() : 400.0;
        double totalLocalTransport = localTransportPerDay * (nights + 1) * Math.ceil((double) travellers / 4); // 1 auto/taxi per 4 people

        // Accommodation
        double accommodationPerNight = calculateAccommodationCost(req.getAccommodationType());
        double totalAccommodation = accommodationPerNight * nights * Math.ceil((double) travellers / 2); // 1 room per 2 people
        String accommodationBreakdown = String.format(
            "%s - \u20b9%.0f/night \u00d7 %d nights \u00d7 %d room(s)",
            req.getAccommodationType() != null ? req.getAccommodationType() : "Standard",
            accommodationPerNight, nights, (int) Math.ceil((double) travellers / 2)
        );

        // Food
        double foodPerPersonPerDay = req.getFoodBudgetPerPersonPerDay() != null
                ? req.getFoodBudgetPerPersonPerDay() : 500.0;
        double totalFood = foodPerPersonPerDay * travellers * (nights + 1);

        // Attraction entry fees
        double totalEntryFees = 0.0;
        if (req.getSelectedDestinationIds() != null && !req.getSelectedDestinationIds().isEmpty()) {
            List<Destination> selected = destinationRepository.findAllByIdIn(req.getSelectedDestinationIds());
            totalEntryFees = selected.stream()
                    .mapToDouble(d -> d.getEntryFee() != null ? d.getEntryFee() : 0.0)
                    .sum() * travellers;
        }

        // Miscellaneous
        double misc = req.getMiscellaneousBudget() != null ? req.getMiscellaneousBudget() : 500.0;

        double total = totalTransport + totalLocalTransport + totalAccommodation + totalFood + totalEntryFees + misc;
        double perPerson = total / travellers;

        return BudgetResponseDTO.builder()
                .transportationCost(roundToTwo(totalTransport))
                .transportationBreakdown(transportBreakdown)
                .localTransportCost(roundToTwo(totalLocalTransport))
                .accommodationCost(roundToTwo(totalAccommodation))
                .accommodationBreakdown(accommodationBreakdown)
                .foodCost(roundToTwo(totalFood))
                .attractionEntryFees(roundToTwo(totalEntryFees))
                .miscellaneousCost(roundToTwo(misc))
                .totalCost(roundToTwo(total))
                .perPersonCost(roundToTwo(perPerson))
                .numberOfTravellers(travellers)
                .numberOfNights(nights)
                .travelMode(req.getTravelMode() != null ? req.getTravelMode().name() : "BUS")
                .travelClass(req.getTravelClass())
                .accommodationType(req.getAccommodationType())
                .disclaimer("All prices are estimated figures for planning purposes only. Actual costs may vary based on season, booking timing, and availability. Please verify current fares with respective service providers.")
                .build();
    }

    private double calculateTransportCost(com.cycleaware.backend.enums.TravelMode mode, String travelClass) {
        if (mode == null) return 400.0;
        return switch (mode) {
            case TRAIN -> switch (travelClass != null ? travelClass.toUpperCase() : "") {
                case "GENERAL" -> 180.0;
                case "SLEEPER" -> 320.0;
                case "AC_3T" -> 650.0;
                case "AC_2T" -> 950.0;
                case "AC_1T" -> 1500.0;
                default -> 320.0;
            };
            case BUS -> switch (travelClass != null ? travelClass.toUpperCase() : "") {
                case "GOVERNMENT" -> 300.0;
                case "PRIVATE_ORDINARY" -> 350.0;
                case "PRIVATE_AC" -> 550.0;
                case "SLEEPER" -> 700.0;
                default -> 400.0;
            };
            case CAR -> switch (travelClass != null ? travelClass.toUpperCase() : "") {
                case "OWN_CAR" -> 1200.0; // fuel + tolls per trip
                case "RENTAL" -> 2500.0;
                case "TAXI" -> 3500.0;
                default -> 2000.0;
            };
        };
    }

    private double calculateAccommodationCost(String type) {
        if (type == null) return 1200.0;
        return switch (type.toUpperCase()) {
            case "BUDGET" -> 700.0;
            case "STANDARD" -> 1200.0;
            case "PREMIUM" -> 2500.0;
            case "LUXURY" -> 5000.0;
            default -> 1200.0;
        };
    }

    private double roundToTwo(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}

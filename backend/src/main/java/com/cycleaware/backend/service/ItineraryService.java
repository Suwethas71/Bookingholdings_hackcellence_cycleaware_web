package com.cycleaware.backend.service;

import com.cycleaware.backend.dto.*;
import com.cycleaware.backend.entity.CycleProfile;
import com.cycleaware.backend.entity.Destination;
import com.cycleaware.backend.entity.User;
import com.cycleaware.backend.enums.PreferredPace;
import com.cycleaware.backend.enums.SymptomSeverity;
import com.cycleaware.backend.repository.CycleProfileRepository;
import com.cycleaware.backend.repository.DestinationRepository;
import com.cycleaware.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ItineraryService {

    private final UserRepository userRepository;
    private final CycleProfileRepository cycleProfileRepository;
    private final DestinationRepository destinationRepository;
    private final GeminiApiClient geminiApiClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional(readOnly = true)
    public ItineraryResponseDTO generateItinerary(String userEmail, ItineraryRequestDTO request) {
        // 1. Fetch user & optional CycleProfile in O(1) time
        User user = null;
        CycleProfile cycleProfile = null;
        if (userEmail != null && !userEmail.isBlank()) {
            user = userRepository.findByEmail(userEmail).orElse(null);
            if (user != null) {
                cycleProfile = cycleProfileRepository.findByUser(user).orElse(null);
            }
        }

        // 2. Fetch selected destination entities by IDs in O(K) time
        List<Long> destinationIds = request.getDestinationIds() != null ? request.getDestinationIds() : Collections.emptyList();
        List<Destination> destinations = destinationRepository.findAllByIdIn(destinationIds);

        int tripDays = (request.getTripDays() != null && request.getTripDays() > 0) ? request.getTripDays() : 2;
        boolean hasCycleProfile = (cycleProfile != null);

        // 3. Construct prompt for Gemini
        String prompt = buildGeminiPrompt(destinations, tripDays, cycleProfile, request.getTripTitle());

        // 4. Call Gemini 1.5 Flash API
        String rawAiResponse = null;
        try {
            rawAiResponse = geminiApiClient.generateContent(prompt);
            if (rawAiResponse == null || rawAiResponse.isBlank()) {
                System.err.println("WARNING: AI Generation failed, using Fallback. Reason: Gemini API returned null/empty response (verify gemini.api.key).");
            }
        } catch (Exception e) {
            System.err.println("WARNING: AI Generation failed, using Fallback. Reason: " + e.getMessage());
        }

        if (rawAiResponse != null && !rawAiResponse.isBlank()) {
            try {
                ItineraryResponseDTO parsed = parseGeminiResponse(rawAiResponse, hasCycleProfile, cycleProfile, tripDays, destinations.size());
                if (parsed != null && parsed.getDays() != null && !parsed.getDays().isEmpty()) {
                    parsed.setAiProvider("Google Gemini 1.5 Flash (Direct API)");
                    parsed.setGeneratedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
                    return parsed;
                }
            } catch (Exception e) {
                System.err.println("WARNING: AI Generation failed, using Fallback. Reason: " + e.getMessage());
                log.error("Failed to parse Gemini response JSON: {}. Proceeding to fallback synthesis.", e.getMessage());
            }
        }

        // 5. Deterministic High-Quality Fallback Synthesis Engine
        log.info("Generating deterministic cycle-aware itinerary synthesis.");
        return generateDeterministicItinerary(destinations, tripDays, cycleProfile, request.getTripTitle());
    }

    private String buildGeminiPrompt(List<Destination> destinations, int tripDays, CycleProfile profile, String customTitle) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are an expert AI travel planner and women's comfort consultant for CycleAware.\n");
        sb.append("Create a detailed, balanced, day-by-day travel itinerary using ONLY the provided destinations.\n\n");

        sb.append("TRIP PARAMETERS:\n");
        sb.append("- Route: Coimbatore to Kanniyakumari, Tamil Nadu\n");
        sb.append("- Duration: ").append(tripDays).append(" Days\n");
        if (customTitle != null && !customTitle.isBlank()) {
            sb.append("- Custom Title: ").append(customTitle).append("\n");
        }

        sb.append("\nSELECTED DESTINATIONS (Total: ").append(destinations.size()).append("):\n");
        for (Destination d : destinations) {
            sb.append(String.format("• ID %d: %s | Category: %s | Duration: %s | Entry Fee: ₹%.0f | Location: %s | Highlights: %s\n",
                    d.getId(), d.getName(), d.getCategory(), d.getEstimatedDuration(),
                    d.getEntryFee() != null ? d.getEntryFee() : 0.0,
                    d.getLocation(), d.getHighlights() != null ? d.getHighlights() : ""));
        }

        sb.append("\nMENSTRUAL CYCLE & ADVANCED COMFORT PROFILE MODIFIERS:\n");
        sb.append("CycleAware adapts itineraries to menstrual phases and physical comfort levels.\n");
        if (profile != null) {
            sb.append("The traveller has enabled CycleAware and provided their comfort preferences:\n");
            sb.append("- Symptom Severity: ").append(profile.getSymptomSeverity()).append(" (MENSTRUAL_PHASE / DISCOMFORT)\n");
            sb.append("- Preferred Travel Pace: ").append(profile.getPreferredPace()).append("\n");
            sb.append("- Average Cycle Length: ").append(profile.getCycleLength() != null ? profile.getCycleLength() : 28).append(" days\n");
            sb.append("\nREQUIRED MODIFIER RULES:\n");
            sb.append("• RULE 1 (Location-Specific Real Amenities): DO NOT use generic text or repeat these instructions. You MUST use your real-world geographical knowledge of Kanniyakumari to provide SPECIFIC, factual details for EACH destination.\n");
            sb.append("   - Restrooms: State exactly where they are (e.g., 'Pay-and-use toilets available near the ferry ticket counter').\n");
            sb.append("   - Sanitary Supplies: Estimate distance to actual town areas (e.g., 'Pharmacies available 1km away in the main market').\n");
            sb.append("   - Medical Support: Name the nearest facility (e.g., 'Kanyakumari Government Hospital is 2km away').\n");
            sb.append("   - Hydration: Detail the local scene (e.g., 'Tender coconut vendors align the pathway to the beach').\n");
            sb.append("   Inject these real details into a cohesive, conversational comfortNote string.\n");

            if (profile.getSymptomSeverity() == SymptomSeverity.HIGH) {
                sb.append("• HIGH SYMPTOMS / ACTIVE MENSTRUAL PHASE: Cap walking sessions under 60 minutes, enforce 30-min shaded rest breaks, avoid steep stair climbs, and advise on cramp relief and immediate sanitary pad/washroom availability.\n");
            } else if (profile.getSymptomSeverity() == SymptomSeverity.MODERATE) {
                sb.append("• MODERATE SYMPTOMS: Balanced schedule with 30-min buffers, comfortable footwear recommendations, tender coconut hydration, and nearby restroom checkpoints.\n");
            } else {
                sb.append("• LOW SYMPTOMS: Active sightseeing with sensible hydration and regular comfort amenity checkpoints.\n");
            }

            if (profile.getPreferredPace() == PreferredPace.RELAXED) {
                sb.append("• RELAXED PACE: Cap activities to maximum 2 attractions per day with ample seaside or cafe downtime.\n");
            } else if (profile.getPreferredPace() == PreferredPace.ACTIVE) {
                sb.append("• ACTIVE PACE: Efficiently plan activities in cooler morning and sunset hours.\n");
            }
        } else {
            sb.append("• RULE 1 (Location-Specific Real Amenities): DO NOT use generic text or repeat these instructions. You MUST use your real-world geographical knowledge of Kanniyakumari to provide SPECIFIC, factual details for EACH destination (exact restrooms, nearest pharmacy with sanitary pads, nearest clinic/hospital for emergencies, and local tender coconut/juice stalls).\n");
        }

        sb.append("\nSTRICT JSON OUTPUT SCHEMA:\n");
        sb.append("Return ONLY a valid JSON object with no markdown fences, matching this exact structure:\n");
        sb.append("{\n");
        sb.append("  \"tripTitle\": \"String\",\n");
        sb.append("  \"totalDays\": ").append(tripDays).append(",\n");
        sb.append("  \"totalDestinations\": ").append(destinations.size()).append(",\n");
        sb.append("  \"cycleAwarePersonalized\": ").append(profile != null).append(",\n");
        sb.append("  \"cycleProfileSummary\": \"String describing how comfort modifiers were applied\",\n");
        sb.append("  \"days\": [\n");
        sb.append("    {\n");
        sb.append("      \"dayNumber\": 1,\n");
        sb.append("      \"title\": \"Day 1: Title\",\n");
        sb.append("      \"theme\": \"Theme of the day\",\n");
        sb.append("      \"dailyComfortGuidance\": \"Comfort and pacing tip for the day\",\n");
        sb.append("      \"activities\": [\n");
        sb.append("        {\n");
        sb.append("          \"timeSlot\": \"Morning | Afternoon | Evening | Sunset\",\n");
        sb.append("          \"timeRange\": \"08:30 AM - 10:30 AM\",\n");
        sb.append("          \"destinationId\": 1,\n");
        sb.append("          \"destinationName\": \"Name\",\n");
        sb.append("          \"category\": \"SCENIC\",\n");
        sb.append("          \"duration\": \"1-2 hours\",\n");
        sb.append("          \"activityDescription\": \"Specific recommendations\",\n");
        sb.append("          \"comfortNote\": \"Restrooms: ... | Sanitary Supplies: ... | Medical Support: ... | Hydration: ...\",\n");
        sb.append("          \"location\": \"Location\",\n");
        sb.append("          \"entryFee\": 0.0\n");
        sb.append("        }\n");
        sb.append("      ]\n");
        sb.append("    }\n");
        sb.append("  ]\n");
        sb.append("}\n");

        return sb.toString();
    }

    private ItineraryResponseDTO parseGeminiResponse(String rawJson, boolean hasCycleProfile, CycleProfile profile, int tripDays, int destinationCount) {
        try {
            // Strip any accidental markdown formatting
            String cleanJson = rawJson.trim();
            if (cleanJson.startsWith("```json")) {
                cleanJson = cleanJson.substring(7);
            } else if (cleanJson.startsWith("```")) {
                cleanJson = cleanJson.substring(3);
            }
            if (cleanJson.endsWith("```")) {
                cleanJson = cleanJson.substring(0, cleanJson.length() - 3);
            }
            cleanJson = cleanJson.trim();

            JsonNode root = objectMapper.readTree(cleanJson);

            String tripTitle = root.path("tripTitle").asText("Coimbatore to Kanniyakumari AI Travel Itinerary");
            String cycleSummary = root.path("cycleProfileSummary").asText(
                    hasCycleProfile ? "Personalized with CycleAware comfort modifiers" : "Standard balanced pacing"
            );

            List<ItineraryDayDTO> days = new ArrayList<>();
            JsonNode daysNode = root.path("days");
            if (daysNode.isArray()) {
                for (JsonNode dayNode : daysNode) {
                    List<ItineraryActivityDTO> activities = new ArrayList<>();
                    JsonNode actNode = dayNode.path("activities");
                    if (actNode.isArray()) {
                        for (JsonNode act : actNode) {
                            String cNote = act.hasNonNull("comfortNote")
                                    ? act.path("comfortNote").asText()
                                    : act.path("comfortNotes").asText("");

                            activities.add(ItineraryActivityDTO.builder()
                                    .timeSlot(act.path("timeSlot").asText("Daytime"))
                                    .timeRange(act.path("timeRange").asText("Flexible"))
                                    .destinationId(act.path("destinationId").asLong(0L))
                                    .destinationName(act.path("destinationName").asText("Attraction"))
                                    .category(act.path("category").asText("SCENIC"))
                                    .duration(act.path("duration").asText("1-2 hours"))
                                    .activityDescription(act.path("activityDescription").asText(""))
                                    .comfortNotes(cNote)
                                    .location(act.path("location").asText("Kanniyakumari"))
                                    .entryFee(act.path("entryFee").asDouble(0.0))
                                    .build());
                        }
                    }

                    days.add(ItineraryDayDTO.builder()
                            .dayNumber(dayNode.path("dayNumber").asInt(days.size() + 1))
                            .title(dayNode.path("title").asText("Day " + (days.size() + 1)))
                            .theme(dayNode.path("theme").asText("Sightseeing"))
                            .dailyComfortGuidance(dayNode.path("dailyComfortGuidance").asText(""))
                            .activities(activities)
                            .build());
                }
            }

            return ItineraryResponseDTO.builder()
                    .tripTitle(tripTitle)
                    .totalDays(tripDays)
                    .totalDestinations(destinationCount)
                    .cycleAwarePersonalized(hasCycleProfile)
                    .cycleProfileSummary(cycleSummary)
                    .days(days)
                    .build();
        } catch (Exception e) {
            log.warn("Error parsing Gemini JSON: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Deterministic High-Quality Synthesis Engine
     * Distributes destinations across the specified days and injects personalized
     * CycleProfile modifiers (symptom severity, pace, comfort guidance).
     */
    private ItineraryResponseDTO generateDeterministicItinerary(
            List<Destination> destinations,
            int tripDays,
            CycleProfile profile,
            String customTitle) {

        boolean hasProfile = (profile != null);
        SymptomSeverity severity = hasProfile && profile.getSymptomSeverity() != null
                ? profile.getSymptomSeverity() : SymptomSeverity.MODERATE;
        PreferredPace pace = hasProfile && profile.getPreferredPace() != null
                ? profile.getPreferredPace() : PreferredPace.MODERATE;

        String profileSummary = hasProfile
                ? String.format("CycleAware Activated: Paced for %s symptom severity and %s travel pace with built-in hydration & shaded rest stops.", severity, pace)
                : "Standard Travel Pacing: Balanced morning, afternoon, and coastal sunset sightseeing.";

        String title = (customTitle != null && !customTitle.isBlank())
                ? customTitle
                : "Coimbatore ➔ Kanniyakumari " + tripDays + "-Day Curated Itinerary";

        // Group destinations across days
        List<ItineraryDayDTO> days = new ArrayList<>();
        int totalItems = destinations.size();
        int itemsPerDay = Math.max(1, (int) Math.ceil((double) totalItems / tripDays));

        String[] timeSlots = {"Morning", "Midday", "Afternoon", "Sunset"};
        String[] timeRanges = {"08:00 AM - 10:30 AM", "11:00 AM - 01:00 PM", "03:00 PM - 04:30 PM", "05:00 PM - 06:45 PM"};

        for (int d = 1; d <= tripDays; d++) {
            int startIndex = (d - 1) * itemsPerDay;
            int endIndex = Math.min(startIndex + itemsPerDay, totalItems);

            List<Destination> dayPlaces = (startIndex < totalItems)
                    ? destinations.subList(startIndex, endIndex)
                    : Collections.emptyList();

            String dayTitle = switch (d) {
                case 1 -> "Day 1: Arrival & Iconic Coastal Shrines";
                case 2 -> "Day 2: Waterfalls, Heritage & Architectural Marvels";
                case 3 -> "Day 3: Serene Reservoirs, Quiet Beaches & Return Journey";
                default -> "Day " + d + ": Regional Exploration & Leisure";
            };

            String dayTheme = switch (d) {
                case 1 -> "Sea Confluence, Meditation & Sunset Views";
                case 2 -> "Nature Immersion, Shaded Walks & Palace History";
                case 3 -> "Gentle Coastal Breezes & Souvenir Shopping";
                default -> "Local Experiences & Scenic Relaxation";
            };

            String dailyComfortGuidance;
            if (severity == SymptomSeverity.HIGH) {
                dailyComfortGuidance = "🌸 High Discomfort Mode: Walking sessions capped at 60 mins. Shaded benches, electrolyte hydration, and nearby rest facilities prioritized.";
            } else if (severity == SymptomSeverity.MODERATE) {
                dailyComfortGuidance = "🌿 Moderate Comfort Mode: 30-min buffer times between attractions. Wear cushioned walking shoes and stay hydrated with fresh coconut water.";
            } else {
                dailyComfortGuidance = "⚡ Steady Energy Mode: Active sightseeing with pleasant afternoon breeze and evening relaxation.";
            }

            List<ItineraryActivityDTO> activities = new ArrayList<>();
            for (int i = 0; i < dayPlaces.size(); i++) {
                Destination dest = dayPlaces.get(i);
                String slot = timeSlots[Math.min(i, timeSlots.length - 1)];
                String range = timeRanges[Math.min(i, timeRanges.length - 1)];

                String comfortNotes = buildComfortNote(dest, severity, pace);

                activities.add(ItineraryActivityDTO.builder()
                        .timeSlot(slot)
                        .timeRange(range)
                        .destinationId(dest.getId())
                        .destinationName(dest.getName())
                        .category(dest.getCategory() != null ? dest.getCategory().name() : "SCENIC")
                        .duration(dest.getEstimatedDuration() != null ? dest.getEstimatedDuration() : "1-2 hours")
                        .activityDescription(dest.getDescription())
                        .comfortNotes(comfortNotes)
                        .location(dest.getLocation())
                        .entryFee(dest.getEntryFee() != null ? dest.getEntryFee() : 0.0)
                        .build());
            }

            days.add(ItineraryDayDTO.builder()
                    .dayNumber(d)
                    .title(dayTitle)
                    .theme(dayTheme)
                    .dailyComfortGuidance(dailyComfortGuidance)
                    .activities(activities)
                    .build());
        }

        return ItineraryResponseDTO.builder()
                .tripTitle(title)
                .totalDays(tripDays)
                .totalDestinations(destinations.size())
                .cycleAwarePersonalized(hasProfile)
                .cycleProfileSummary(profileSummary)
                .days(days)
                .aiProvider("CycleAware Engine (Deterministic Synthesis)")
                .generatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .build();
    }

    private String buildComfortNote(Destination dest, SymptomSeverity severity, PreferredPace pace) {
        String cat = dest.getCategory() != null ? dest.getCategory().name() : "";
        String spatialAmenities = getRealSpatialAmenities(dest);

        if (severity == SymptomSeverity.HIGH) {
            String advice = switch (cat) {
                case "BEACH" -> "Gentle stroll along firm sand. Rest under seaside shacks with fresh lime juice. Avoid deep wading.";
                case "NATURE" -> "Waterfall area has wet steps; use handrails and enjoy the mist from the viewing deck rather than steep descents.";
                case "RELIGIOUS" -> "Cool temple stone corridors provide calm and relief. Benches available inside the mandapam.";
                case "MONUMENT", "HERITAGE" -> "Take the ferry seating inside covered cabins. Allow an extra 20-min sit-down at the Shripada Mandapam.";
                default -> "Shaded rest stops available nearby. Keep a water bottle handy and limit walking intervals.";
            };
            return advice + " " + spatialAmenities;
        } else if (severity == SymptomSeverity.MODERATE) {
            String advice = switch (cat) {
                case "BEACH" -> "Relaxed beachcombing; watch fishing catamarans at sunset.";
                case "NATURE" -> "Moderate walking trails with refreshing river breezes. Great picnic spot.";
                case "HERITAGE" -> "Wooden palace has ventilated corridors; moderate stair climbing.";
                default -> "Balanced pace. 15-minute rest interval between photo sessions.";
            };
            return advice + " " + spatialAmenities;
        } else {
            return "Good walking terrain. Take in panoramic 360-degree views and photography. " + spatialAmenities;
        }
    }

    private String getRealSpatialAmenities(Destination dest) {
        String name = dest.getName() != null ? dest.getName().toLowerCase() : "";
        if (name.contains("sunrise") || (name.contains("beach") && name.contains("kanniyakumari"))) {
            return "Pay-and-use toilets available near the sunrise beach pavilion. Pharmacies available 800m away on Sannathi Street stocking sanitary pads. Kanyakumari Government Hospital is 1.8km away on Main Road. Tender coconut vendors and hot tea stalls line the coastal promenade.";
        } else if (name.contains("thiruvalluvar") || name.contains("vivekananda") || name.contains("rock")) {
            return "Clean public washrooms available near the ferry ticket counter and inside Shripada Mandapam. Sanitary pads available at medical stores 600m from jetty on Beach Road. Kanyakumari Government Hospital is 2km away for emergencies. Filtered water kiosks on the rock and fresh tender coconut stalls along the mainland jetty path.";
        } else if (name.contains("palace") || name.contains("padmanabhapuram")) {
            return "Modern tourist washrooms inside the palace ticket complex. Thuckalay town pharmacies are 1.5km away stocking sanitary pads and pain relief. Thuckalay Government Hospital is 2km away. Shaded tender coconut and fresh lime juice stalls are stationed directly opposite the main entrance.";
        } else if (name.contains("waterfall") || name.contains("thirparappu")) {
            return "Restrooms and changing rooms available beside the Kodayar bathing ghats. Pharmacies located 3km away in Kulasekharam town with sanitary pads. Kulasekharam Government Hospital is 3.5km away for emergencies. Tender coconut vendors and fresh fruit juice stalls line the parking area.";
        } else if (name.contains("temple") || name.contains("suchindram") || name.contains("amman") || name.contains("nagaraja")) {
            return "Devotee restrooms available in the temple complex. Pharmacies and chemist shops located 400m along Car Street stocking sanitary pads. Government Primary Health Centre is 1.5km away. Fresh tender coconut and chilled buttermilk stalls line the temple approach.";
        } else if (name.contains("aqueduct") || name.contains("mathoor")) {
            return "Restrooms available near the lower children's park entrance. Pharmacies available 2km away at Mathoor junction. Regional clinic is 2.5km away for emergencies. Local tender coconut vendors and tea stalls available near the stairway base.";
        } else if (name.contains("fort") || name.contains("vattakottai")) {
            return "Basic public restrooms available near the fort parking lot. Chemist shops located 3km away in Kottaram town stocking sanitary supplies. Kottaram Government Clinic is 3.2km away. Tender coconut vendors stationed along the coastal pathway.";
        } else if (name.contains("dam") || name.contains("chittar") || name.contains("pechiparai")) {
            return "Restrooms available near the PWD inspection bungalow. Pharmacies located 4km away in the nearest town market. Community health clinic 4.5km away. Tender coconut and bottled water stalls available near the dam viewpoint.";
        } else {
            return "Clean public washrooms available at the visitor facility. Town pharmacies and medical stores located within 1km stocking sanitary pads. Kanyakumari Government Hospital is 2km away for emergencies. Tender coconut vendors and cafes provide hydration along the approach.";
        }
    }
}


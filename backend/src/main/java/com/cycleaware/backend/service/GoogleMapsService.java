package com.cycleaware.backend.service;

import com.cycleaware.backend.dto.AmenityResponseDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleMapsService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${google.maps.api.key:}")
    private String googleMapsApiKey;

    private static final String PLACES_NEW_NEARBY_URL = "https://places.googleapis.com/v1/places:searchNearby";
    private static final double WALKING_SPEED_METERS_PER_SEC = 1.4;
    private static final double EARTH_RADIUS_METERS = 6371000.0;
    private static final int MAX_RESULTS = 3;

    public List<AmenityResponseDTO> findNearbyAmenities(double lat, double lng, String type) {
        String normalizedType = normalizeType(type);
        String apiKey = googleMapsApiKey != null ? googleMapsApiKey.trim() : "";

        if (apiKey.isEmpty() || apiKey.contains("YOUR_GOOGLE_MAPS_API_KEY")) {
            log.error("Google Maps API key is missing or not configured.");
            return Collections.emptyList();
        }

        String googleType = mapToGooglePlaceType(normalizedType);

        try {
            String url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="
                    + lat + "," + lng + "&radius=1500&type=" + googleType + "&key=" + apiKey;
            if ("restroom".equals(normalizedType)) {
                url += "&keyword=public+restroom";
            }

            log.info("Calling live Google Places Nearby Search for type={} (googleType={}) at ({}, {})",
                    normalizedType, googleType, lat, lng);

            String rawJson = restTemplate.getForObject(url, String.class);
            if (rawJson != null && !rawJson.isBlank()) {
                JsonNode root = objectMapper.readTree(rawJson);
                String status = root.path("status").asText();

                if ("OK".equalsIgnoreCase(status)) {
                    return parseLegacyPlacesResults(root.path("results"), lat, lng, normalizedType);
                }

                if ("REQUEST_DENIED".equalsIgnoreCase(status) || "ZERO_RESULTS".equalsIgnoreCase(status)) {
                    log.warn("Legacy Places API status={} ({}). Switching to live Places API (New).",
                            status, root.path("error_message").asText(""));
                    return fetchViaPlacesNewApi(lat, lng, normalizedType, apiKey);
                }

                log.warn("Google Places API returned status={} ({})", status, root.path("error_message").asText(""));
            }
        } catch (Exception e) {
            log.error("Error calling Legacy Google Places API: {}. Trying live Places API (New).", e.getMessage());
            try {
                return fetchViaPlacesNewApi(lat, lng, normalizedType, apiKey);
            } catch (Exception newApiEx) {
                log.error("Error calling live Places API (New): {}", newApiEx.getMessage());
            }
        }

        return Collections.emptyList();
    }

    private List<AmenityResponseDTO> fetchViaPlacesNewApi(double lat, double lng, String normalizedType, String apiKey) {
        try {
            String newApiType = mapToPlacesNewType(normalizedType);

            Map<String, Object> center = new LinkedHashMap<>();
            center.put("latitude", lat);
            center.put("longitude", lng);

            Map<String, Object> circle = new LinkedHashMap<>();
            circle.put("center", center);
            circle.put("radius", 1500.0);

            Map<String, Object> locationRestriction = new LinkedHashMap<>();
            locationRestriction.put("circle", circle);

            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("includedTypes", List.of(newApiType));
            payload.put("maxResultCount", MAX_RESULTS);
            payload.put("locationRestriction", locationRestriction);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Goog-Api-Key", apiKey);
            headers.set("X-Goog-FieldMask", "places.displayName,places.shortFormattedAddress,places.formattedAddress,places.rating,places.location");

            String requestBody = objectMapper.writeValueAsString(payload);
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            String rawJson = restTemplate.postForObject(PLACES_NEW_NEARBY_URL, entity, String.class);
            if (rawJson == null || rawJson.isBlank()) {
                return Collections.emptyList();
            }

            JsonNode root = objectMapper.readTree(rawJson);
            return parsePlacesNewResults(root.path("places"), lat, lng, normalizedType);
        } catch (Exception e) {
            log.error("Failed fetching live Places API (New) results for type={}: {}", normalizedType, e.getMessage());
            return Collections.emptyList();
        }
    }

    private List<AmenityResponseDTO> parseLegacyPlacesResults(JsonNode resultsNode, double originLat, double originLng, String normalizedType) {
        List<AmenityResponseDTO> list = new ArrayList<>();
        if (!resultsNode.isArray()) {
            return list;
        }

        int count = Math.min(resultsNode.size(), MAX_RESULTS);
        for (int i = 0; i < count; i++) {
            JsonNode place = resultsNode.get(i);
            String name = place.path("name").asText();
            if (name.isBlank()) {
                continue;
            }
            String vicinity = place.path("vicinity").asText("");
            double rating = place.has("rating") ? place.path("rating").asDouble(0.0) : 0.0;

            JsonNode location = place.path("geometry").path("location");
            double destLat = location.path("lat").asDouble(originLat);
            double destLng = location.path("lng").asDouble(originLng);

            list.add(buildAmenityDto(name, vicinity, originLat, originLng, destLat, destLng, rating, normalizedType));
        }
        return list;
    }

    private List<AmenityResponseDTO> parsePlacesNewResults(JsonNode placesNode, double originLat, double originLng, String normalizedType) {
        List<AmenityResponseDTO> list = new ArrayList<>();
        if (!placesNode.isArray()) {
            return list;
        }

        int count = Math.min(placesNode.size(), MAX_RESULTS);
        for (int i = 0; i < count; i++) {
            JsonNode place = placesNode.get(i);
            String name = place.path("displayName").path("text").asText();
            if (name.isBlank()) {
                continue;
            }
            String address = place.path("shortFormattedAddress").asText("");
            if (address.isBlank()) {
                address = place.path("formattedAddress").asText("");
            }
            double rating = place.has("rating") ? place.path("rating").asDouble(0.0) : 0.0;

            JsonNode location = place.path("location");
            double destLat = location.path("latitude").asDouble(originLat);
            double destLng = location.path("longitude").asDouble(originLng);

            list.add(buildAmenityDto(name, address, originLat, originLng, destLat, destLng, rating, normalizedType));
        }
        return list;
    }

    private AmenityResponseDTO buildAmenityDto(
            String name,
            String address,
            double originLat,
            double originLng,
            double destLat,
            double destLng,
            double rating,
            String normalizedType) {

        double distanceMeters = calculateHaversineMeters(originLat, originLng, destLat, destLng);
        String walkingDistance = formatDistance(distanceMeters);
        String walkingDuration = formatWalkingDuration(distanceMeters);
        List<String> comfortTags = buildComfortTags(normalizedType, rating);
        String directionsUrl = String.format(
                Locale.US,
                "https://www.google.com/maps/dir/?api=1&destination=%.6f,%.6f&travelmode=walking",
                destLat,
                destLng
        );

        AmenityResponseDTO dto = new AmenityResponseDTO();
        dto.setName(name);
        dto.setAddress(address);
        dto.setWalkingDistance(walkingDistance);
        dto.setWalkingDuration(walkingDuration);
        dto.setRating(Math.round(rating * 10.0) / 10.0);
        dto.setComfortTags(comfortTags);
        dto.setGoogleMapsDirectionsUrl(directionsUrl);
        return dto;
    }

    private double calculateHaversineMeters(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_METERS * c;
    }

    private String formatDistance(double meters) {
        if (meters >= 1000) {
            return String.format(Locale.US, "%.1f km", meters / 1000.0);
        }
        return Math.round(meters) + " m";
    }

    private String formatWalkingDuration(double meters) {
        double seconds = (meters * 1.2) / WALKING_SPEED_METERS_PER_SEC;
        long minutes = Math.max(1, Math.round(seconds / 60.0));
        return minutes + (minutes == 1 ? " min walk" : " mins walk");
    }

    private List<String> buildComfortTags(String normalizedType, double rating) {
        double cleanRating = Math.round(rating * 10.0) / 10.0;
        String cleanlinessTag = cleanRating > 0
                ? "Cleanliness rating: " + cleanRating + "/5"
                : "Public comfort station";
        return switch (normalizedType) {
            case "pharmacy" -> Arrays.asList(
                    "Stocks variety of sanitary pads",
                    "Pain relief available",
                    "Price: Standard MRP"
            );
            case "restroom" -> Arrays.asList(
                    "Pay-and-use (approx ₹5-₹10)",
                    "Dress changing facility standard",
                    cleanlinessTag
            );
            case "hospital" -> Arrays.asList(
                    "24/7 Emergency & Gynecology Care",
                    "Severe cramp & urgent relief",
                    "Walk-in clinic support"
            );
            case "hydration" -> Arrays.asList(
                    "Fresh tender coconut & fruit juices",
                    "Electrolyte & heat relief",
                    "Shaded seating available"
            );
            default -> Arrays.asList("Verified CycleAware Amenity", "Tourist Friendly");
        };
    }

    private String mapToGooglePlaceType(String normalizedType) {
        return switch (normalizedType) {
            case "pharmacy" -> "pharmacy";
            case "hospital" -> "hospital";
            case "hydration" -> "cafe";
            default -> "point_of_interest";
        };
    }

    private String mapToPlacesNewType(String normalizedType) {
        return switch (normalizedType) {
            case "pharmacy" -> "pharmacy";
            case "hospital" -> "hospital";
            case "hydration" -> "cafe";
            default -> "public_bathroom";
        };
    }

    private String normalizeType(String type) {
        if (type == null || type.isBlank()) {
            return "restroom";
        }
        String lower = type.trim().toLowerCase(Locale.ROOT);
        if (lower.contains("pharm") || lower.contains("sanit") || lower.contains("pad") || lower.contains("chem")) {
            return "pharmacy";
        }
        if (lower.contains("hosp") || lower.contains("med") || lower.contains("clinic")) {
            return "hospital";
        }
        if (lower.contains("hydr") || lower.contains("juice") || lower.contains("coco") || lower.contains("cafe")) {
            return "hydration";
        }
        return "restroom";
    }
}

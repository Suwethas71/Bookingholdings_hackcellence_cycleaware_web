package com.cycleaware.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiApiClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    public String generateContent(String prompt) {
        if (apiKey == null || apiKey.isBlank() || apiKey.contains("YOUR_GEMINI_API_KEY")) {
            System.err.println("WARNING: AI Generation failed, using Fallback. Reason: Gemini API key is missing or set to placeholder in application.properties (gemini.api.key).");
            log.warn("Gemini API key is not configured or is placeholder. Using deterministic itinerary synthesis.");
            return null;
        }

        try {
            String url = GEMINI_API_URL + "?key=" + apiKey.trim();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Construct Gemini API Payload with JSON mime-type request
            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);

            Map<String, Object> content = new HashMap<>();
            content.put("role", "user");
            content.put("parts", Collections.singletonList(part));

            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("temperature", 0.2);
            generationConfig.put("responseMimeType", "application/json");

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Collections.singletonList(content));
            requestBody.put("generationConfig", generationConfig);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            log.info("Sending prompt to Gemini 1.5 Flash API...");
            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && !candidates.isEmpty()) {
                    JsonNode parts = candidates.get(0).path("content").path("parts");
                    if (parts.isArray() && !parts.isEmpty()) {
                        String generatedText = parts.get(0).path("text").asText();
                        log.info("Successfully received generated content from Gemini.");
                        return generatedText;
                    }
                }
            } else {
                System.err.println("WARNING: AI Generation failed, using Fallback. Reason: Gemini HTTP status " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("WARNING: AI Generation failed, using Fallback. Reason: " + e.getMessage());
            log.error("Failed to query Gemini API: {}. Falling back to deterministic cycle-aware itinerary engine.", e.getMessage());
        }

        return null;
    }
}


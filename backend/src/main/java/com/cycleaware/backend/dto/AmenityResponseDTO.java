package com.cycleaware.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmenityResponseDTO {
    private String name;
    private String address;
    private String walkingDistance;
    private String walkingDuration;
    private double rating;
    private List<String> comfortTags;
    private String googleMapsDirectionsUrl;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getWalkingDistance() { return walkingDistance; }
    public void setWalkingDistance(String walkingDistance) { this.walkingDistance = walkingDistance; }

    public String getWalkingDuration() { return walkingDuration; }
    public void setWalkingDuration(String walkingDuration) { this.walkingDuration = walkingDuration; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public List<String> getComfortTags() { return comfortTags; }
    public void setComfortTags(List<String> comfortTags) { this.comfortTags = comfortTags; }

    public String getGoogleMapsDirectionsUrl() { return googleMapsDirectionsUrl; }
    public void setGoogleMapsDirectionsUrl(String googleMapsDirectionsUrl) { this.googleMapsDirectionsUrl = googleMapsDirectionsUrl; }
}


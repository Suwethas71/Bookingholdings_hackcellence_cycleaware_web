package com.cycleaware.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackDTO {
    private Long id;
    private Integer overallRating;
    private Integer destinationAccuracyRating;
    private Integer budgetCalculatorRating;
    private String comments;
    private String suggestedPlaces;
    private String userName;
    private LocalDateTime submittedAt;

    // Explicit standard getters & setters for guaranteed IDE compatibility
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getOverallRating() { return overallRating; }
    public void setOverallRating(Integer overallRating) { this.overallRating = overallRating; }

    public Integer getDestinationAccuracyRating() { return destinationAccuracyRating; }
    public void setDestinationAccuracyRating(Integer destinationAccuracyRating) { this.destinationAccuracyRating = destinationAccuracyRating; }

    public Integer getBudgetCalculatorRating() { return budgetCalculatorRating; }
    public void setBudgetCalculatorRating(Integer budgetCalculatorRating) { this.budgetCalculatorRating = budgetCalculatorRating; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public String getSuggestedPlaces() { return suggestedPlaces; }
    public void setSuggestedPlaces(String suggestedPlaces) { this.suggestedPlaces = suggestedPlaces; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}

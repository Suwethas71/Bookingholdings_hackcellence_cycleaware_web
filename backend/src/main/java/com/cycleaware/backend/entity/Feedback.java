package com.cycleaware.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer overallRating; // 1-5

    private Integer destinationAccuracyRating; // 1-5

    private Integer budgetCalculatorRating; // 1-5

    @Column(length = 2000)
    private String comments;

    @Column(length = 500)
    private String suggestedPlaces;

    private String userName; // optional

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        if (this.submittedAt == null) {
            this.submittedAt = LocalDateTime.now();
        }
    }

    // Explicit standard getters & setters to guarantee 100% IDE compatibility
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

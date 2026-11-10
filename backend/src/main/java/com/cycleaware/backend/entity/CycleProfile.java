package com.cycleaware.backend.entity;

import com.cycleaware.backend.enums.PreferredPace;
import com.cycleaware.backend.enums.SymptomSeverity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cycle_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CycleProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    private LocalDate lastPeriodDate;

    private Integer cycleLength;

    @Enumerated(EnumType.STRING)
    private SymptomSeverity symptomSeverity;

    @Enumerated(EnumType.STRING)
    private PreferredPace preferredPace;

    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}


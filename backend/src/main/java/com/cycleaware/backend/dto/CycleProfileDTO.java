package com.cycleaware.backend.dto;

import com.cycleaware.backend.enums.PreferredPace;
import com.cycleaware.backend.enums.SymptomSeverity;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CycleProfileDTO {
    private Long id;
    private LocalDate lastPeriodDate;
    private Integer cycleLength;
    private SymptomSeverity symptomSeverity;
    private PreferredPace preferredPace;
    private LocalDateTime updatedAt;
}


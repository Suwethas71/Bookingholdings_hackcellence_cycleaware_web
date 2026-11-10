package com.cycleaware.backend.controller;

import com.cycleaware.backend.dto.FeedbackDTO;
import com.cycleaware.backend.entity.Feedback;
import com.cycleaware.backend.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;

    @PostMapping
    public ResponseEntity<FeedbackDTO> submitFeedback(@RequestBody FeedbackDTO dto) {
        System.out.println("API HIT: Submitting feedback from " + dto.getUserName());
        
        Feedback feedback = new Feedback();
        feedback.setOverallRating(dto.getOverallRating() != null ? dto.getOverallRating() : 5);
        feedback.setDestinationAccuracyRating(dto.getDestinationAccuracyRating() != null ? dto.getDestinationAccuracyRating() : 5);
        feedback.setBudgetCalculatorRating(dto.getBudgetCalculatorRating() != null ? dto.getBudgetCalculatorRating() : 5);
        feedback.setComments(dto.getComments());
        feedback.setSuggestedPlaces(dto.getSuggestedPlaces());
        feedback.setUserName((dto.getUserName() != null && !dto.getUserName().isBlank()) ? dto.getUserName().trim() : "Anonymous Traveller");

        Feedback savedFeedback = feedbackRepository.save(feedback);

        dto.setId(savedFeedback.getId());
        dto.setUserName(savedFeedback.getUserName());
        dto.setSubmittedAt(savedFeedback.getSubmittedAt());
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<FeedbackDTO>> getAllFeedback() {
        System.out.println("API HIT: Fetching feedbacks");
        List<FeedbackDTO> list = feedbackRepository.findAll(Sort.by(Sort.Direction.DESC, "id")).stream()
                .map(f -> FeedbackDTO.builder()
                        .id(f.getId())
                        .overallRating(f.getOverallRating())
                        .destinationAccuracyRating(f.getDestinationAccuracyRating())
                        .budgetCalculatorRating(f.getBudgetCalculatorRating())
                        .comments(f.getComments())
                        .suggestedPlaces(f.getSuggestedPlaces())
                        .userName(f.getUserName())
                        .submittedAt(f.getSubmittedAt())
                        .build())
                .collect(Collectors.toList());

        System.out.println("Returning " + list.size() + " feedbacks from database");
        return ResponseEntity.ok(list);
    }
}

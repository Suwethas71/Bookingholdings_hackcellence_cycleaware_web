package com.cycleaware.backend.controller;

import com.cycleaware.backend.dto.BudgetRequestDTO;
import com.cycleaware.backend.dto.BudgetResponseDTO;
import com.cycleaware.backend.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budget")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping("/calculate")
    public ResponseEntity<BudgetResponseDTO> calculate(@RequestBody BudgetRequestDTO req) {
        return ResponseEntity.ok(budgetService.calculate(req));
    }
}

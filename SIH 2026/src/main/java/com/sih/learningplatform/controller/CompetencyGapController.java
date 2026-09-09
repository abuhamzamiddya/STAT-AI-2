package com.sih.learningplatform.controller;

import com.sih.learningplatform.dto.ApiResponse;
import com.sih.learningplatform.dto.GapAnalysisResponse;
import com.sih.learningplatform.service.CompetencyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gaps")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class CompetencyGapController {
    private final CompetencyService competencyService;
    @PostMapping("/analyze/{employeeId}")
    public ResponseEntity<ApiResponse<GapAnalysisResponse>> analyzeGap(@PathVariable Long employeeId) {
        log.info("Received request: POST /api/gaps/analyze/{}", employeeId);
        GapAnalysisResponse response = competencyService.analyzeGaps(employeeId);
        return ResponseEntity.ok(ApiResponse.success("Competency gap analysis completed successfully", response));
    }
}

package com.sih.learningplatform.controller;

import com.sih.learningplatform.dto.ApiResponse;
import com.sih.learningplatform.dto.TrainingRecommendationResponse;
import com.sih.learningplatform.service.TrainingRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/training")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TrainingRecommendationController {
    private final TrainingRecommendationService trainingRecommendationService;
    @GetMapping("/recommend/{employeeId}")
    public ResponseEntity<ApiResponse<TrainingRecommendationResponse>> recommendTraining(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success("iGOT Karmayogi training recommendations retrieved successfully", trainingRecommendationService.recommendCourses(employeeId)));
    }
}

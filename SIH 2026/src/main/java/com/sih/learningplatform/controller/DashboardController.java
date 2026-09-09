package com.sih.learningplatform.controller;

import com.sih.learningplatform.dto.ApiResponse;
import com.sih.learningplatform.dto.DashboardOverview;
import com.sih.learningplatform.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {
    private final DashboardService dashboardService;
    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<DashboardOverview>> getOverview() {
        return ResponseEntity.ok(ApiResponse.success("Dashboard overview retrieved successfully", dashboardService.getOverview()));
    }
}

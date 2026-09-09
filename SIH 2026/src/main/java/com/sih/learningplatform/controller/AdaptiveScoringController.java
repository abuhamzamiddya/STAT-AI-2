package com.sih.learningplatform.controller;

import com.sih.learningplatform.dto.AdaptiveScoreRequest;
import com.sih.learningplatform.dto.AdaptiveScoreResponse;
import com.sih.learningplatform.service.AdaptiveScoringService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/adaptive")
@RequiredArgsConstructor
public class AdaptiveScoringController {
    private final AdaptiveScoringService adaptiveScoringService;

    @PostMapping("/score")
    public AdaptiveScoreResponse score(@Valid @RequestBody AdaptiveScoreRequest request) {
        return adaptiveScoringService.score(request);
    }
}

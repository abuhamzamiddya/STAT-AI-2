package com.sih.learningplatform.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdaptiveScoreResponse {
    private Long quizId;
    private Long employeeId;
    private int correctAnswers;
    private int totalQuestions;
    private double weightedScore;
    private String masteryLevel;
    private String nextDifficulty;
    private String recommendation;
}

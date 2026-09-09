package com.sih.learningplatform.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
public class AdaptiveScoreRequest {
    @NotNull
    private Long quizId;
    private Long employeeId;
    private Map<Long, String> answers;
}

package com.sih.learningplatform.dto;
import lombok.*; import java.time.*; import java.util.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class QuizResponse { private Long quizId; private Long materialId; private String materialTitle; private int totalQuestions; private List<QuestionDto> questions; private LocalDateTime createdAt; }

package com.sih.learningplatform.dto;
import lombok.*; import java.util.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class QuestionDto { private Long id; private String questionText; private String optionA; private String optionB; private String optionC; private String optionD; private String correctAnswer; }

package com.sih.learningplatform.dto;
import jakarta.validation.constraints.*; import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class QuizGenerateRequest { @NotBlank(message="Document title cannot be blank") @Size(max=255) private String title; @NotBlank(message="Document text content cannot be blank") @Size(min=20) private String documentText; }

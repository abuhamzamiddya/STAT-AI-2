package com.sih.learningplatform.dto;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CourseRecommendation { private String title; private String url; private String skillTargeted; private String provider; private String estimatedDuration; }

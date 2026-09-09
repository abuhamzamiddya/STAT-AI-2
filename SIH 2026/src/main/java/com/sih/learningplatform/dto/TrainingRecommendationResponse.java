package com.sih.learningplatform.dto;
import lombok.*; import java.util.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TrainingRecommendationResponse { private Long employeeId; private String employeeName; private String designation; private int missingSkillsCount; private List<String> missingSkills; private List<CourseRecommendation> recommendedCourses; }

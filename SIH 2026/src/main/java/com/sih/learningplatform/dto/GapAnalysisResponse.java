package com.sih.learningplatform.dto;
import lombok.*; import java.util.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GapAnalysisResponse { private Long employeeId; private String employeeName; private String designation; private List<String> currentSkills; private List<String> requiredSkills; private List<String> missingSkills; private double competencyMatchPercentage; }

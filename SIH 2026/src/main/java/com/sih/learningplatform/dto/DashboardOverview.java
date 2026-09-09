package com.sih.learningplatform.dto;
import lombok.*; import java.util.*;
@Getter @Builder @Value
public class DashboardOverview { long totalEmployees; long activeLearningPrograms; long generatedQuizzes; double averageCompetencyScore; long criticalSkillGaps; List<EmployeeAttention> employeesNeedingAttention; List<SkillGap> topSkillGaps;
 @Value @Builder public static class EmployeeAttention { Long employeeId; String employeeName; String designation; double competencyScore; int missingSkills; String priority; }
 @Value @Builder public static class SkillGap { String skill; long affectedEmployees; }
}

package com.sih.learningplatform.init;
import com.sih.learningplatform.entity.*; import com.sih.learningplatform.repository.*; import lombok.RequiredArgsConstructor; import org.springframework.boot.CommandLineRunner; import org.springframework.stereotype.Component; import java.time.*; import java.util.*;
@Component @RequiredArgsConstructor public class DataInitializer implements CommandLineRunner {
 private final EmployeeRepository employeeRepository; private final RoleCompetencyRepository roleCompetencyRepository; private final LearningMaterialRepository learningMaterialRepository;
 public void run(String... args){
  roleCompetencyRepository.saveAll(List.of(
   RoleCompetency.builder().designation("Assistant Section Officer").requiredSkills(List.of("e-Office Administration","RTI Act & Governance","Public Financial Management","Procurement & GeM")).build(),
   RoleCompetency.builder().designation("Section Officer").requiredSkills(List.of("e-Office Administration","Public Financial Management","Procurement & GeM","Citizen Grievance Redressal","Project Management")).build(),
   RoleCompetency.builder().designation("Data Analyst").requiredSkills(List.of("Data Analytics in Governance","Cybersecurity & Data Privacy","Project Management")).build()));
  employeeRepository.saveAll(List.of(
   Employee.builder().name("Diwakar Snehi").designation("Assistant Section Officer").currentSkills(List.of("e-Office Administration")).build(),
   Employee.builder().name("Mehtab Alam").designation("Section Officer").currentSkills(List.of("e-Office Administration","Procurement & GeM","Citizen Grievance Redressal")).build(),
   Employee.builder().name("Manali").designation("Data Analyst").currentSkills(List.of("Data Analytics in Governance")).build()));
  learningMaterialRepository.save(LearningMaterial.builder().title("Overview of Government e-Marketplace (GeM) 4.0").contentText("The Government e-Marketplace (GeM) is an online platform for public procurement in India. The primary objective is transparency, efficiency and speed in public procurement. Rule 149 of GFR 2017 covers procurement through GeM.").createdAt(LocalDateTime.now()).build());
 }
}

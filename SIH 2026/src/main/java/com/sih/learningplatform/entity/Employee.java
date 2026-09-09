package com.sih.learningplatform.entity;
import jakarta.persistence.*; import lombok.*; import java.util.*;
@Entity @Table(name="employees") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @ToString
public class Employee { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false) private String name; @Column(nullable=false) private String designation; @ElementCollection(fetch=FetchType.EAGER) @CollectionTable(name="employee_skills",joinColumns=@JoinColumn(name="employee_id")) @Column(name="skill") @Builder.Default private List<String> currentSkills=new ArrayList<>(); }

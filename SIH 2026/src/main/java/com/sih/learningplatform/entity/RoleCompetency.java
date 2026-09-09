package com.sih.learningplatform.entity;
import jakarta.persistence.*; import lombok.*; import java.util.*;
@Entity @Table(name="role_competencies") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @ToString
public class RoleCompetency { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false,unique=true) private String designation; @ElementCollection(fetch=FetchType.EAGER) @CollectionTable(name="role_required_skills",joinColumns=@JoinColumn(name="role_competency_id")) @Column(name="skill") @Builder.Default private List<String> requiredSkills=new ArrayList<>(); }

package com.sih.learningplatform.entity;
import jakarta.persistence.*; import lombok.*; import java.time.*;
@Entity @Table(name="learning_materials") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @ToString
public class LearningMaterial { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false) private String title; @Lob @Column(name="content_text",columnDefinition="CLOB") private String contentText; @Column(name="created_at") @Builder.Default private LocalDateTime createdAt=LocalDateTime.now(); }

package com.sih.learningplatform.controller;

import com.sih.learningplatform.dto.*;
import com.sih.learningplatform.entity.Quiz;
import com.sih.learningplatform.exception.ResourceNotFoundException;
import com.sih.learningplatform.repository.QuizRepository;
import com.sih.learningplatform.service.QuizGenerationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuizController {
    private final QuizGenerationService quizGenerationService;
    private final QuizRepository quizRepository;
    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<QuizResponse>> generateQuiz(@Valid @RequestBody QuizGenerateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("AI Quiz generated and persisted successfully", quizGenerationService.generateQuiz(request)));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<QuizResponse>> getQuizById(@PathVariable Long id) {
        Quiz quiz = quizRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + id));
        List<QuestionDto> questionDtos = quiz.getGeneratedQuestions().stream().map(q -> QuestionDto.builder().id(q.getId()).questionText(q.getQuestionText()).optionA(q.getOptionA()).optionB(q.getOptionB()).optionC(q.getOptionC()).optionD(q.getOptionD()).correctAnswer(q.getCorrectAnswer()).build()).toList();
        return ResponseEntity.ok(ApiResponse.success("Quiz retrieved successfully", QuizResponse.builder().quizId(quiz.getId()).materialId(quiz.getMaterialId()).totalQuestions(questionDtos.size()).questions(questionDtos).createdAt(quiz.getCreatedAt()).build()));
    }
}

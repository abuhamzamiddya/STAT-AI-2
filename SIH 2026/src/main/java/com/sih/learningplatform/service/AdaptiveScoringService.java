package com.sih.learningplatform.service;

import com.sih.learningplatform.dto.AdaptiveScoreRequest;
import com.sih.learningplatform.dto.AdaptiveScoreResponse;
import com.sih.learningplatform.entity.Question;
import com.sih.learningplatform.entity.Quiz;
import com.sih.learningplatform.exception.ResourceNotFoundException;
import com.sih.learningplatform.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdaptiveScoringService {
    private final QuizRepository quizRepository;

    public AdaptiveScoreResponse score(AdaptiveScoreRequest request) {
        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found: " + request.getQuizId()));

        List<Question> questions = quiz.getGeneratedQuestions();
        Map<Long, String> answers = request.getAnswers() == null ? Map.of() : request.getAnswers();

        double earned = 0.0;
        double available = 0.0;
        int correct = 0;

        for (int i = 0; i < questions.size(); i++) {
            Question question = questions.get(i);
            double weight = weightFor(i);
            available += weight;
            String submitted = answers.get(question.getId());
            if (submitted != null && sameAnswer(submitted, question.getCorrectAnswer())) {
                earned += weight;
                correct++;
            }
        }

        double score = available == 0 ? 0 : Math.round((earned / available) * 1000.0) / 10.0;
        String mastery = score >= 85 ? "Advanced" : score >= 70 ? "Proficient" : score >= 50 ? "Developing" : "Foundation";
        String nextDifficulty = score >= 85 ? "Advanced" : score >= 70 ? "Intermediate" : "Foundation";
        String recommendation = switch (mastery) {
            case "Advanced" -> "Increase question difficulty and introduce scenario-based assessment.";
            case "Proficient" -> "Maintain the current level and add applied case questions.";
            case "Developing" -> "Reinforce weak concepts before progressing to harder questions.";
            default -> "Start with foundational concepts and targeted remediation.";
        };

        return AdaptiveScoreResponse.builder()
                .quizId(quiz.getId())
                .employeeId(request.getEmployeeId())
                .correctAnswers(correct)
                .totalQuestions(questions.size())
                .weightedScore(score)
                .masteryLevel(mastery)
                .nextDifficulty(nextDifficulty)
                .recommendation(recommendation)
                .build();
    }

    private double weightFor(int index) {
        return switch (index % 3) {
            case 1 -> 1.25;
            case 2 -> 1.5;
            default -> 1.0;
        };
    }

    private boolean sameAnswer(String submitted, String correct) {
        String a = submitted.trim().toLowerCase();
        String b = String.valueOf(correct).trim().toLowerCase();
        if (a.equals(b)) return true;
        if (a.startsWith("option") && a.length() == 7) return a.substring(6).equals(b);
        if (b.startsWith("option") && b.length() == 7) return b.substring(6).equals(a);
        return false;
    }
}

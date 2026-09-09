package com.sih.learningplatform.repository;
import com.sih.learningplatform.entity.Question; import org.springframework.data.jpa.repository.JpaRepository; import org.springframework.stereotype.Repository; import java.util.*;
@Repository public interface QuestionRepository extends JpaRepository<Question,Long>{ List<Question> findByQuizId(Long quizId); }

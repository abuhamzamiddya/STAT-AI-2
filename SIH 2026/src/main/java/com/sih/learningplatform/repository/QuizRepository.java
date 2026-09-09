package com.sih.learningplatform.repository;
import com.sih.learningplatform.entity.Quiz; import org.springframework.data.jpa.repository.JpaRepository; import org.springframework.stereotype.Repository; import java.util.*;
@Repository public interface QuizRepository extends JpaRepository<Quiz,Long>{ List<Quiz> findByMaterialId(Long materialId); }

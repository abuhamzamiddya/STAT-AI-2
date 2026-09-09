package com.sih.learningplatform.repository;
import com.sih.learningplatform.entity.RoleCompetency; import org.springframework.data.jpa.repository.JpaRepository; import org.springframework.stereotype.Repository; import java.util.*;
@Repository public interface RoleCompetencyRepository extends JpaRepository<RoleCompetency,Long>{ Optional<RoleCompetency> findByDesignationIgnoreCase(String designation); }

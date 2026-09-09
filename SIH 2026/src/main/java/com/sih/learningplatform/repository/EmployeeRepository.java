package com.sih.learningplatform.repository;
import com.sih.learningplatform.entity.Employee; import org.springframework.data.jpa.repository.JpaRepository; import org.springframework.stereotype.Repository; import java.util.*;
@Repository public interface EmployeeRepository extends JpaRepository<Employee,Long>{ Optional<Employee> findByNameIgnoreCase(String name); }

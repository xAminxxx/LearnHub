package com.iit.trainingcenter.repository;

import com.iit.trainingcenter.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Course findByCode(String code);
}

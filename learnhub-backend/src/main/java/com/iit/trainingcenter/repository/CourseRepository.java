package com.iit.trainingcenter.repository;

import com.iit.trainingcenter.entity.Course;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {

    @Override
    @EntityGraph(attributePaths = { "trainer", "specialization", "enrollments" })
    List<Course> findAll();

    @Override
    @EntityGraph(attributePaths = { "trainer", "specialization", "enrollments" })
    Optional<Course> findById(Long id);

    Course findByCode(String code);

    boolean existsByCode(String code);

    List<Course> findBySpecializationId(Long specializationId);
}

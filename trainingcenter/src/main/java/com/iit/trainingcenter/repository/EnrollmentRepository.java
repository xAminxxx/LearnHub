package com.iit.trainingcenter.repository;

import com.iit.trainingcenter.entity.Enrollment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

	@Override
	@EntityGraph(attributePaths = { "student", "course" })
	List<Enrollment> findAll();

	@Override
	@EntityGraph(attributePaths = { "student", "course" })
	Optional<Enrollment> findById(Long id);

	@EntityGraph(attributePaths = { "student", "course" })
	List<Enrollment> findByStudentId(Long studentId);
}

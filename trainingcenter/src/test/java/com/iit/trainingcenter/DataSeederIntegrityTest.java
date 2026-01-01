package com.iit.trainingcenter;

import com.iit.trainingcenter.entity.Course;
import com.iit.trainingcenter.entity.Enrollment;
import com.iit.trainingcenter.entity.Student;
import com.iit.trainingcenter.entity.Trainer;
import com.iit.trainingcenter.repository.CourseRepository;
import com.iit.trainingcenter.repository.EnrollmentRepository;
import com.iit.trainingcenter.repository.StudentRepository;
import com.iit.trainingcenter.repository.TrainerRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class DataSeederIntegrityTest {
	@Autowired
	private CourseRepository courseRepository;
	@Autowired
	private EnrollmentRepository enrollmentRepository;
	@Autowired
	private StudentRepository studentRepository;
	@Autowired
	private TrainerRepository trainerRepository;

	@Test
	void seededCoursesAlwaysHaveTrainer() {
		assertThat(courseRepository.count()).isGreaterThan(0);
		for (Course course : courseRepository.findAll()) {
			assertThat(course.getTrainer())
					.as("Course %s must have trainer", course.getCode())
					.isNotNull();
			assertThat(course.getSpecialization())
					.as("Course %s must have specialization", course.getCode())
					.isNotNull();
		}
	}

	@Test
	void seededStudentsAndTrainersHaveRequiredFields() {
		assertThat(studentRepository.count()).isGreaterThan(0);
		for (Student student : studentRepository.findAll()) {
			assertThat(student.getEmail()).isNotBlank();
			assertThat(student.getFirstName()).isNotBlank();
			assertThat(student.getLastName()).isNotBlank();
			assertThat(student.getPhone()).isNotBlank();
			assertThat(student.getBirthDate()).isNotNull();
			assertThat(student.getEnrollmentDate()).isNotNull();
			assertThat(student.getSpecialization()).isNotNull();
		}

		assertThat(trainerRepository.count()).isGreaterThan(0);
		for (Trainer trainer : trainerRepository.findAll()) {
			assertThat(trainer.getEmail()).isNotBlank();
			assertThat(trainer.getFirstName()).isNotBlank();
			assertThat(trainer.getLastName()).isNotBlank();
			assertThat(trainer.getPhone()).isNotBlank();
			assertThat(trainer.getHireDate()).isNotNull();
			assertThat(trainer.getSpecialization()).isNotNull();
		}
	}

	@Test
	void seededEnrollmentsHaveEnrollmentDate() {
		assertThat(enrollmentRepository.count()).isGreaterThanOrEqualTo(0);
		for (Enrollment enrollment : enrollmentRepository.findAll()) {
			assertThat(enrollment.getStudent()).isNotNull();
			assertThat(enrollment.getCourse()).isNotNull();
			assertThat(enrollment.getEnrollmentDate())
					.as("Enrollment must have non-null enrollmentDate")
					.isNotNull();
		}
	}
}

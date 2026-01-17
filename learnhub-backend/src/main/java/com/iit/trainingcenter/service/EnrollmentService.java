package com.iit.trainingcenter.service;

import com.iit.trainingcenter.entity.Enrollment;
import com.iit.trainingcenter.repository.EnrollmentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@AllArgsConstructor
@Service
@Transactional(readOnly = true)
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;

    @Transactional(readOnly = true)
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Enrollment getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Enrollment> getStudentEnrollments(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    @Transactional
    public Enrollment createEnrollment(Enrollment enrollment) {
        if (enrollment.getCourse() != null && !enrollment.getCourse().isAvailable()) {
            throw new IllegalStateException("Course capacity reached: " + enrollment.getCourse().getCode());
        }
        return enrollmentRepository.save(enrollment);
    }

    @Transactional
    public Enrollment updateEnrollment(Long id, Enrollment enrollmentDetails) {
        Enrollment enrollment = enrollmentRepository.findById(id).orElse(null);
        if (enrollment != null) {
            enrollment.setStudent(enrollmentDetails.getStudent());
            enrollment.setCourse(enrollmentDetails.getCourse());
            enrollment.setStatus(enrollmentDetails.getStatus());
            enrollment.setNotes(enrollmentDetails.getNotes());
            enrollment.setScore(enrollmentDetails.getScore());
            enrollment.setGradeType(enrollmentDetails.getGradeType());
            return enrollmentRepository.save(enrollment);
        }
        return null;
    }

    @Transactional
    public void deleteEnrollment(Long id) {
        enrollmentRepository.deleteById(id);
    }
}

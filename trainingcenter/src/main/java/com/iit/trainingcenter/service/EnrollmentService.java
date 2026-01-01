package com.iit.trainingcenter.service;

import com.iit.trainingcenter.entity.Enrollment;
import com.iit.trainingcenter.repository.EnrollmentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@AllArgsConstructor
@Service
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

    public Enrollment createEnrollment(Enrollment enrollment) {
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment updateEnrollment(Long id, Enrollment enrollmentDetails) {
        Enrollment enrollment = enrollmentRepository.findById(id).orElse(null);
        if (enrollment != null) {
            enrollment.setStudent(enrollmentDetails.getStudent());
            enrollment.setCourse(enrollmentDetails.getCourse());
            enrollment.setStatus(enrollmentDetails.getStatus());
            return enrollmentRepository.save(enrollment);
        }
        return null;
    }

    public void deleteEnrollment(Long id) {
        enrollmentRepository.deleteById(id);
    }
}

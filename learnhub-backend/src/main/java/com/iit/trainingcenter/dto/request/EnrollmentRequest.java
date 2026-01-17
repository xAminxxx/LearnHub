package com.iit.trainingcenter.dto.request;

import com.iit.trainingcenter.entity.EnrollmentStatus;

public record EnrollmentRequest(
        Long studentId,
        Long courseId,
        EnrollmentStatus status,
        String notes,
        Double score,
        String gradeType) {
}

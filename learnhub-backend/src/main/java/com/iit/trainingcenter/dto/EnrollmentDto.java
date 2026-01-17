package com.iit.trainingcenter.dto;

import com.iit.trainingcenter.entity.EnrollmentStatus;

import java.time.LocalDateTime;

/**
 * API-safe representation of an enrollment.
 */
public record EnrollmentDto(
        Long id,
        Long studentId,
        String studentName,
        Long courseId,
        String courseCode,
        EnrollmentStatus status,
        LocalDateTime enrollmentDate,
        LocalDateTime completionDate,
        String notes,
        Double score,
        String gradeType
) {
}

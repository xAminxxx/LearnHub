package com.iit.trainingcenter.dto;

import java.util.List;

/**
 * Dashboard statistics for a student.
 */
public record StudentDashboardDto(
        StudentDto student,
        long activeEnrollments,
        long completedCourses,
        double averageScore,
        List<EnrollmentDto> enrollments
) {
}

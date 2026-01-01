package com.iit.trainingcenter.dto;

/**
 * API-safe representation of a course.
 */
public record CourseDto(
        Long id,
        String code,
        String title,
        String description,
        int credit,
        int maxStudents,
        TrainerDto trainer,
        SpecializationDto specialization
) {
}

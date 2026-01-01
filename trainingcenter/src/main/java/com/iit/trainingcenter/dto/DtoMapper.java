package com.iit.trainingcenter.dto;

import com.iit.trainingcenter.entity.*;

/**
 * Minimal mapping helpers for converting JPA entities to DTOs.
 *
 * Keep mapping shallow to avoid touching lazy collections.
 */
public final class DtoMapper {

    private DtoMapper() {
    }

    public static SpecializationDto toDto(Specialization s) {
        if (s == null) return null;
        return new SpecializationDto(s.getId(), s.getName(), s.getDescription());
    }

    public static TrainerDto toDto(Trainer t) {
        if (t == null) return null;
        return new TrainerDto(
                t.getId(),
                t.getFirstName(),
                t.getLastName(),
                t.getEmail(),
                t.getPhone(),
                t.getHireDate(),
                t.getBio(),
                toDto(t.getSpecialization())
        );
    }

    public static StudentDto toDto(Student s) {
        if (s == null) return null;
        return new StudentDto(
                s.getId(),
                s.getFirstName(),
                s.getLastName(),
                s.getEmail(),
                s.getPhone(),
                s.getBirthDate(),
                s.getEnrollmentDate(),
                toDto(s.getSpecialization())
        );
    }

    public static CourseDto toDto(Course c) {
        if (c == null) return null;
        // Course.name is mapped to DB column `title`
        return new CourseDto(
                c.getId(),
                c.getCode(),
                c.getName(),
                c.getDescription(),
                c.getCredit(),
                c.getMaxStudents(),
                toDto(c.getTrainer()),
                toDto(c.getSpecialization())
        );
    }

    public static EnrollmentDto toDto(Enrollment e) {
        if (e == null) return null;
        String studentName = null;
        if (e.getStudent() != null) {
            studentName = e.getStudent().getFirstName() + " " + e.getStudent().getLastName();
        }
        return new EnrollmentDto(
                e.getId(),
                e.getStudent() != null ? e.getStudent().getId() : null,
                studentName,
                e.getCourse() != null ? e.getCourse().getId() : null,
                e.getCourse() != null ? e.getCourse().getCode() : null,
                e.getStatus(),
                e.getEnrollmentDate(),
                e.getCompletionDate(),
                e.getNotes(),
                e.getScore(),
                e.getGradeType()
        );
    }
}

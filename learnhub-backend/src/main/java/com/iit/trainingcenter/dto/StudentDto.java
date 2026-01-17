package com.iit.trainingcenter.dto;

import java.time.LocalDate;

/**
 * API-safe representation of a student.
 */
public record StudentDto(
                Long id,
                String firstName,
                String lastName,
                String fullName,
                String email,
                String phone,
                LocalDate birthDate,
                LocalDate enrollmentDate,
                SpecializationDto specialization) {
}

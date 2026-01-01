package com.iit.trainingcenter.dto;

import java.time.LocalDate;

/**
 * API-safe representation of a trainer.
 */
public record TrainerDto(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phone,
        LocalDate hireDate,
        String bio,
        SpecializationDto specialization
) {
}

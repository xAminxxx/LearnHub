package com.iit.trainingcenter.dto;

import java.time.LocalDate;

/**
 * Request DTO for creating/updating trainers.
 *
 * We don't accept JPA entities directly to avoid Jackson binding issues and
 * to keep the API payload stable.
 */
public record TrainerUpsertRequest(
        String firstName,
        String lastName,
        String email,
        String phone,
        LocalDate hireDate,
        String bio,
        Long specializationId
) {
}

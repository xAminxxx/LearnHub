package com.iit.trainingcenter.dto.request;

import java.time.LocalDate;

public record TrainerRequest(
        String firstName,
        String lastName,
        String email,
        String phone,
        LocalDate hireDate,
        String bio,
        Long specializationId) {
}

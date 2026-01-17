package com.iit.trainingcenter.dto.request;

import java.time.LocalDate;

public record StudentRequest(
        String firstName,
        String lastName,
        String email,
        String phone,
        LocalDate birthDate,
        LocalDate enrollmentDate,
        Long specializationId) {
}

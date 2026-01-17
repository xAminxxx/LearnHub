package com.iit.trainingcenter.dto;

/**
 * API-safe representation of a specialization.
 * Keeps relations shallow to avoid lazy-loading and recursion issues.
 */
public record SpecializationDto(
                Long id,
                String name,
                String description,
                int courseCount,
                int studentCount,
                int trainerCount) {
}

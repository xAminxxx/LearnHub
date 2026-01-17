package com.iit.trainingcenter.dto.request;

public record CourseRequest(
                String code,
                String title,
                String description,
                int credit,
                int maxStudents,
                Long trainerId,
                Long specializationId) {
}

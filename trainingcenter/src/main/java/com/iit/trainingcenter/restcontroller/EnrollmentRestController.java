package com.iit.trainingcenter.restcontroller;

import com.iit.trainingcenter.dto.DtoMapper;
import com.iit.trainingcenter.dto.EnrollmentDto;
import com.iit.trainingcenter.entity.Enrollment;
import com.iit.trainingcenter.service.EnrollmentService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentRestController {

    private final EnrollmentService enrollmentService;

    @GetMapping
    public List<EnrollmentDto> getAllEnrollments() {
        return enrollmentService.getAllEnrollments().stream().map(DtoMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public EnrollmentDto getEnrollmentById(@PathVariable Long id) {
        return DtoMapper.toDto(enrollmentService.getEnrollmentById(id));
    }

    @PostMapping
    public Enrollment createEnrollment(@RequestBody Enrollment enrollment) {
        return enrollmentService.createEnrollment(enrollment);
    }

    @PutMapping("/{id}")
    public Enrollment updateEnrollment(@PathVariable Long id, @RequestBody Enrollment enrollmentDetails) {
        return enrollmentService.updateEnrollment(id, enrollmentDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
    }
}

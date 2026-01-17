package com.iit.trainingcenter.restcontroller;

import com.iit.trainingcenter.dto.DtoMapper;
import com.iit.trainingcenter.dto.EnrollmentDto;
import com.iit.trainingcenter.dto.request.EnrollmentRequest;
import com.iit.trainingcenter.entity.Enrollment;
import com.iit.trainingcenter.service.CourseService;
import com.iit.trainingcenter.service.EnrollmentService;
import com.iit.trainingcenter.service.StudentService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentRestController {

    private final EnrollmentService enrollmentService;
    private final StudentService studentService;
    private final CourseService courseService;

    @GetMapping
    public List<EnrollmentDto> getAllEnrollments() {
        return enrollmentService.getAllEnrollments().stream().map(DtoMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public EnrollmentDto getEnrollmentById(@PathVariable Long id) {
        return DtoMapper.toDto(enrollmentService.getEnrollmentById(id));
    }

    @PostMapping
    public EnrollmentDto createEnrollment(@RequestBody EnrollmentRequest request) {
        Enrollment enrollment = new Enrollment();
        enrollment.setStatus(request.status());
        enrollment.setNotes(request.notes());
        enrollment.setScore(request.score());
        enrollment.setGradeType(request.gradeType());
        if (request.studentId() != null) {
            enrollment.setStudent(studentService.getStudentById(request.studentId()));
        }
        if (request.courseId() != null) {
            enrollment.setCourse(courseService.getCourseById(request.courseId()));
        }
        return DtoMapper.toDto(enrollmentService.createEnrollment(enrollment));
    }

    @PutMapping("/{id}")
    public EnrollmentDto updateEnrollment(@PathVariable Long id, @RequestBody EnrollmentRequest request) {
        Enrollment details = new Enrollment();
        details.setStatus(request.status());
        details.setNotes(request.notes());
        details.setScore(request.score());
        details.setGradeType(request.gradeType());
        if (request.studentId() != null) {
            details.setStudent(studentService.getStudentById(request.studentId()));
        }
        if (request.courseId() != null) {
            details.setCourse(courseService.getCourseById(request.courseId()));
        }
        return DtoMapper.toDto(enrollmentService.updateEnrollment(id, details));
    }

    @DeleteMapping("/{id}")
    public void deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
    }
}

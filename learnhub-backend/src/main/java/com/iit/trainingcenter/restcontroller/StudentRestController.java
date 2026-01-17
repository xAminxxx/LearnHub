package com.iit.trainingcenter.restcontroller;

import com.iit.trainingcenter.dto.DtoMapper;
import com.iit.trainingcenter.dto.StudentDto;
import com.iit.trainingcenter.dto.request.StudentRequest;
import com.iit.trainingcenter.entity.Student;
import com.iit.trainingcenter.service.SpecializationService;
import com.iit.trainingcenter.service.StudentService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/students")
public class StudentRestController {

    private final StudentService studentService;
    private final SpecializationService specializationService;

    @GetMapping
    public List<StudentDto> getAllStudents() {
        return studentService.getAllStudents().stream().map(DtoMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public StudentDto getStudentById(@PathVariable Long id) {
        return DtoMapper.toDto(studentService.getStudentById(id));
    }

    @PostMapping
    public StudentDto createStudent(@RequestBody StudentRequest request) {
        Student student = new Student();
        student.setFirstName(request.firstName());
        student.setLastName(request.lastName());
        student.setEmail(request.email());
        student.setPhone(request.phone());
        student.setBirthDate(request.birthDate());
        student.setEnrollmentDate(request.enrollmentDate());
        if (request.specializationId() != null) {
            student.setSpecialization(specializationService.getSpecializationById(request.specializationId()));
        }
        return DtoMapper.toDto(studentService.createStudent(student));
    }

    @PutMapping("/{id}")
    public StudentDto updateStudent(@PathVariable Long id, @RequestBody StudentRequest request) {
        Student studentDetails = new Student();
        studentDetails.setFirstName(request.firstName());
        studentDetails.setLastName(request.lastName());
        studentDetails.setEmail(request.email());
        studentDetails.setPhone(request.phone());
        studentDetails.setBirthDate(request.birthDate());
        studentDetails.setEnrollmentDate(request.enrollmentDate());
        if (request.specializationId() != null) {
            studentDetails.setSpecialization(specializationService.getSpecializationById(request.specializationId()));
        }
        return DtoMapper.toDto(studentService.updateStudent(id, studentDetails));
    }

    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
    }
}

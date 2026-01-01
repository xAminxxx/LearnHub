package com.iit.trainingcenter.restcontroller;

import com.iit.trainingcenter.dto.DtoMapper;
import com.iit.trainingcenter.dto.StudentDto;
import com.iit.trainingcenter.entity.Student;
import com.iit.trainingcenter.service.StudentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentRestController {

    private final StudentService studentService;

    public StudentRestController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public List<StudentDto> getAllStudents() {
        return studentService.getAllStudents().stream().map(DtoMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public StudentDto getStudentById(@PathVariable Long id) {
        return DtoMapper.toDto(studentService.getStudentById(id));
    }

    @PostMapping
    public StudentDto createStudent(@RequestBody Student student) {
        return DtoMapper.toDto(studentService.createStudent(student));
    }

    @PutMapping("/{id}")
    public StudentDto updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) {
        return DtoMapper.toDto(studentService.updateStudent(id, studentDetails));
    }

    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
    }
}

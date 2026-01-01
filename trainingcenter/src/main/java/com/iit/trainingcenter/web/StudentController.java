package com.iit.trainingcenter.web;

import com.iit.trainingcenter.entity.Student;
import com.iit.trainingcenter.service.SpecializationService;
import com.iit.trainingcenter.service.StudentService;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;
    private final SpecializationService specializationService;

    public StudentController(StudentService studentService, SpecializationService specializationService) {
        this.studentService = studentService;
        this.specializationService = specializationService;
    }

    @GetMapping
    public String listStudents(Model model, @RequestParam(value = "keyword", required = false) String keyword) {
        if (keyword != null) {
            model.addAttribute("students", studentService.searchStudents(keyword));
        } else {
            model.addAttribute("students", studentService.getAllStudents());
        }
        return "students/list";
    }

    @GetMapping("/new")
    public String showAddForm(Model model) {
        model.addAttribute("student", new Student());
        model.addAttribute("specializations", specializationService.getAllSpecializations());
        return "students/form";
    }

    @PostMapping
    public String saveStudent(@Valid @ModelAttribute("student") Student student, 
            @RequestParam("specializationId") Long specializationId,
            BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("specializations", specializationService.getAllSpecializations());
            return "students/form";
        }
        student.setSpecialization(specializationService.getSpecializationById(specializationId));
        studentService.createStudent(student);
        return "redirect:/students";
    }

    @GetMapping("/edit/{id}")
    public String showUpdateForm(@PathVariable("id") Long id, Model model) {
        Student student = studentService.getStudentById(id);
        model.addAttribute("student", student);
        model.addAttribute("specializations", specializationService.getAllSpecializations());
        return "students/form";
    }

    @PostMapping("/update/{id}")
    public String updateStudent(@PathVariable("id") Long id, @Valid @ModelAttribute("student") Student student,
            @RequestParam("specializationId") Long specializationId,
            BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("specializations", specializationService.getAllSpecializations());
            return "students/form";
        }
        student.setId(id);
        student.setSpecialization(specializationService.getSpecializationById(specializationId));
        studentService.createStudent(student);
        return "redirect:/students";
    }

    @GetMapping("/delete/{id}")
    public String deleteStudent(@PathVariable("id") Long id) {
        studentService.deleteStudent(id);
        return "redirect:/students";
    }
    
    @GetMapping("/{id}")
    public String viewStudent(@PathVariable("id") Long id, Model model) {
        model.addAttribute("student", studentService.getStudentById(id));
        return "students/details";
    }
}
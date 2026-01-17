package com.iit.trainingcenter.web.admin;

import com.iit.trainingcenter.entity.Student;
import com.iit.trainingcenter.service.SpecializationService;
import com.iit.trainingcenter.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin/students")
public class AdminStudentsController {

    private final StudentService studentService;
    private final SpecializationService specializationService;

    public AdminStudentsController(StudentService studentService, SpecializationService specializationService) {
        this.studentService = studentService;
        this.specializationService = specializationService;
    }

    @GetMapping
    public String list(Model model, @RequestParam(value = "keyword", required = false) String keyword) {
        model.addAttribute("pageTitle", "Admin • Students");
        model.addAttribute("keyword", keyword);
        model.addAttribute("students", keyword == null || keyword.isBlank()
                ? studentService.getAllStudents()
                : studentService.searchStudents(keyword));
        return "admin/students/list";
    }

    @GetMapping("/new")
    public String createForm(Model model) {
        model.addAttribute("pageTitle", "Admin • New Student");
        model.addAttribute("student", new Student());
        model.addAttribute("specializations", specializationService.getAllSpecializations());
        return "admin/students/form";
    }

    @PostMapping
    public String create(
            @Valid @ModelAttribute("student") Student student,
            BindingResult result,
            @RequestParam("specializationId") Long specializationId,
            Model model,
            RedirectAttributes ra) {
        if (result.hasErrors()) {
            model.addAttribute("pageTitle", "Admin • New Student");
            model.addAttribute("specializations", specializationService.getAllSpecializations());
            return "admin/students/form";
        }
        try {
            student.setSpecialization(specializationService.getSpecializationById(specializationId));
            studentService.createStudent(student);
            ra.addFlashAttribute("flashSuccess", "Student created successfully");
            return "redirect:/admin/students";
        } catch (IllegalArgumentException ex) {
            model.addAttribute("pageTitle", "Admin • New Student");
            model.addAttribute("specializations", specializationService.getAllSpecializations());
            model.addAttribute("flashError", ex.getMessage());
            return "admin/students/form";
        } catch (DataIntegrityViolationException ex) {
            model.addAttribute("pageTitle", "Admin • New Student");
            model.addAttribute("specializations", specializationService.getAllSpecializations());
            model.addAttribute("flashError", "Could not save student. Email might already be in use.");
            return "admin/students/form";
        }
    }

    @GetMapping("/{id}")
    public String details(@PathVariable Long id, Model model) {
        Student student = studentService.getStudentById(id);
        model.addAttribute("pageTitle", "Admin • Student Details");
        model.addAttribute("student", student);
        return "admin/students/details";
    }

    @GetMapping("/{id}/edit")
    public String editForm(@PathVariable Long id, Model model) {
        Student student = studentService.getStudentById(id);
        model.addAttribute("pageTitle", "Admin • Edit Student");
        model.addAttribute("student", student);
        model.addAttribute("specializations", specializationService.getAllSpecializations());
        return "admin/students/form";
    }

    @PostMapping("/{id}")
    public String update(
            @PathVariable Long id,
            @Valid @ModelAttribute("student") Student student,
            BindingResult result,
            @RequestParam("specializationId") Long specializationId,
            Model model,
            RedirectAttributes ra) {
        if (result.hasErrors()) {
            model.addAttribute("pageTitle", "Admin • Edit Student");
            model.addAttribute("specializations", specializationService.getAllSpecializations());
            return "admin/students/form";
        }

        try {
            student.setSpecialization(specializationService.getSpecializationById(specializationId));
            studentService.updateStudent(id, student);
            ra.addFlashAttribute("flashSuccess", "Student updated successfully");
            return "redirect:/admin/students";
        } catch (IllegalArgumentException ex) {
            ra.addFlashAttribute("flashError", ex.getMessage());
            return "redirect:/admin/students";
        } catch (DataIntegrityViolationException ex) {
            // Most common case: duplicate email (students.email is unique)
            model.addAttribute("pageTitle", "Admin • Edit Student");
            model.addAttribute("specializations", specializationService.getAllSpecializations());
            model.addAttribute("flashError", "Could not save student. Email might already be in use.");
            return "admin/students/form";
        }
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id, RedirectAttributes ra) {
        studentService.deleteStudent(id);
        ra.addFlashAttribute("flashSuccess", "Student deleted successfully");
        return "redirect:/admin/students";
    }
}

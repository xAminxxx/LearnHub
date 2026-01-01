package com.iit.trainingcenter.web.admin;

import com.iit.trainingcenter.entity.Enrollment;
import com.iit.trainingcenter.entity.EnrollmentStatus;
import com.iit.trainingcenter.service.CourseService;
import com.iit.trainingcenter.service.EnrollmentService;
import com.iit.trainingcenter.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin/enrollments")
public class AdminEnrollmentsController {

    private final EnrollmentService enrollmentService;
    private final StudentService studentService;
    private final CourseService courseService;

    public AdminEnrollmentsController(EnrollmentService enrollmentService, StudentService studentService, CourseService courseService) {
        this.enrollmentService = enrollmentService;
        this.studentService = studentService;
        this.courseService = courseService;
    }

    @GetMapping
    public String list(Model model) {
        model.addAttribute("pageTitle", "Admin • Enrollments");
        model.addAttribute("enrollments", enrollmentService.getAllEnrollments());
        return "admin/enrollments/list";
    }

    @GetMapping("/new")
    public String createForm(Model model) {
        Enrollment e = new Enrollment();
        e.setStatus(EnrollmentStatus.ACTIVE);
        model.addAttribute("pageTitle", "Admin • New Enrollment");
        model.addAttribute("enrollment", e);
        model.addAttribute("students", studentService.getAllStudents());
        model.addAttribute("courses", courseService.getAllCourses());
        model.addAttribute("statuses", EnrollmentStatus.values());
        return "admin/enrollments/form";
    }

    @PostMapping
    public String create(
            @Valid @ModelAttribute("enrollment") Enrollment enrollment,
            BindingResult result,
            @RequestParam("studentId") Long studentId,
            @RequestParam("courseId") Long courseId,
            Model model,
            RedirectAttributes ra
    ) {
        if (result.hasErrors()) {
            model.addAttribute("pageTitle", "Admin • New Enrollment");
            model.addAttribute("students", studentService.getAllStudents());
            model.addAttribute("courses", courseService.getAllCourses());
            model.addAttribute("statuses", EnrollmentStatus.values());
            return "admin/enrollments/form";
        }
        enrollment.setStudent(studentService.getStudentById(studentId));
        enrollment.setCourse(courseService.getCourseById(courseId));
        // enrollmentDate is filled by @PrePersist
        enrollmentService.createEnrollment(enrollment);
        ra.addFlashAttribute("flashSuccess", "Enrollment created successfully");
        return "redirect:/admin/enrollments";
    }

    @GetMapping("/{id}")
    public String details(@PathVariable Long id, Model model) {
        model.addAttribute("pageTitle", "Admin • Enrollment Details");
        model.addAttribute("enrollment", enrollmentService.getEnrollmentById(id));
        return "admin/enrollments/details";
    }

    @GetMapping("/{id}/edit")
    public String editForm(@PathVariable Long id, Model model) {
        Enrollment e = enrollmentService.getEnrollmentById(id);
        model.addAttribute("pageTitle", "Admin • Edit Enrollment");
        model.addAttribute("enrollment", e);
        model.addAttribute("students", studentService.getAllStudents());
        model.addAttribute("courses", courseService.getAllCourses());
        model.addAttribute("statuses", EnrollmentStatus.values());
        return "admin/enrollments/form";
    }

    @PostMapping("/{id}")
    public String update(
            @PathVariable Long id,
            @Valid @ModelAttribute("enrollment") Enrollment enrollment,
            BindingResult result,
            @RequestParam("studentId") Long studentId,
            @RequestParam("courseId") Long courseId,
            Model model,
            RedirectAttributes ra
    ) {
        if (result.hasErrors()) {
            model.addAttribute("pageTitle", "Admin • Edit Enrollment");
            model.addAttribute("students", studentService.getAllStudents());
            model.addAttribute("courses", courseService.getAllCourses());
            model.addAttribute("statuses", EnrollmentStatus.values());
            return "admin/enrollments/form";
        }
        enrollment.setStudent(studentService.getStudentById(studentId));
        enrollment.setCourse(courseService.getCourseById(courseId));
        enrollmentService.updateEnrollment(id, enrollment);
        ra.addFlashAttribute("flashSuccess", "Enrollment updated successfully");
        return "redirect:/admin/enrollments";
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id, RedirectAttributes ra) {
        enrollmentService.deleteEnrollment(id);
        ra.addFlashAttribute("flashSuccess", "Enrollment deleted successfully");
        return "redirect:/admin/enrollments";
    }
}

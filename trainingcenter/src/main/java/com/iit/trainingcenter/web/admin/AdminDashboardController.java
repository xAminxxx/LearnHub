package com.iit.trainingcenter.web.admin;

import com.iit.trainingcenter.service.CourseService;
import com.iit.trainingcenter.service.EnrollmentService;
import com.iit.trainingcenter.service.SpecializationService;
import com.iit.trainingcenter.service.StudentService;
import com.iit.trainingcenter.service.TrainerService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AdminDashboardController {

    private final StudentService studentService;
    private final TrainerService trainerService;
    private final CourseService courseService;
    private final SpecializationService specializationService;
    private final EnrollmentService enrollmentService;

    public AdminDashboardController(
            StudentService studentService,
            TrainerService trainerService,
            CourseService courseService,
            SpecializationService specializationService,
            EnrollmentService enrollmentService
    ) {
        this.studentService = studentService;
        this.trainerService = trainerService;
        this.courseService = courseService;
        this.specializationService = specializationService;
        this.enrollmentService = enrollmentService;
    }

    @GetMapping
    public String dashboard(Model model) {
        model.addAttribute("pageTitle", "Admin Dashboard");
        model.addAttribute("studentCount", studentService.getAllStudents().size());
        model.addAttribute("trainerCount", trainerService.getAllTrainers().size());
        model.addAttribute("courseCount", courseService.getAllCourses().size());
        model.addAttribute("specializationCount", specializationService.getAllSpecializations().size());
        model.addAttribute("enrollmentCount", enrollmentService.getAllEnrollments().size());
        return "admin/dashboard";
    }
}

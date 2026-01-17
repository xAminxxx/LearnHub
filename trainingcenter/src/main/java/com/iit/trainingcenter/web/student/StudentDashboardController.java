package com.iit.trainingcenter.web.student;

import com.iit.trainingcenter.entity.Enrollment;
import com.iit.trainingcenter.entity.EnrollmentStatus;
import com.iit.trainingcenter.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentDashboardController {

    private final EnrollmentService enrollmentService;

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        // For now, hardcode student ID = 1 (Alice Smith)
        // Later we'll get this from Spring Security authentication
        Long studentId = 1L;
        
        // Get enrollments from database directly (efficient)
        List<Enrollment> studentEnrollments = enrollmentService.getStudentEnrollments(studentId);
        
        // Calculate KPIs
        long activeEnrollments = studentEnrollments.stream()
                .filter(e -> e.getStatus() == EnrollmentStatus.ACTIVE)
                .count();
        
        long completedCourses = studentEnrollments.stream()
                .filter(e -> e.getStatus() == EnrollmentStatus.COMPLETED)
                .count();
        
        double averageScore = studentEnrollments.stream()
                .filter(e -> e.getScore() != null)
                .mapToDouble(Enrollment::getScore)
                .average()
                .orElse(0.0);
        
        // Add data to model for the view
        model.addAttribute("enrollments", studentEnrollments);
        model.addAttribute("activeEnrollments", activeEnrollments);
        model.addAttribute("completedCourses", completedCourses);
        model.addAttribute("averageScore", String.format("%.2f", averageScore));
        model.addAttribute("studentName", "Alice Smith"); // Hardcoded for now
        
        return "students/dashboard"; // Will return dashboard.html template
    }
}
package com.iit.trainingcenter.web.student;

import com.iit.trainingcenter.entity.Course;
import com.iit.trainingcenter.entity.Specialization;
import com.iit.trainingcenter.service.CourseService;
import com.iit.trainingcenter.service.SpecializationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/student/courses")
@RequiredArgsConstructor
public class StudentCourseController {

    private final CourseService courseService;
    private final SpecializationService specializationService;

    @GetMapping
    public String browseCourses(
            @RequestParam(required = false) Long specializationId,
            Model model) {
        
        List<Course> courses;
        
        // Query database directly instead of filtering in memory
        if (specializationId != null) {
            courses = courseService.getCoursesBySpecialization(specializationId);
        } else {
            courses = courseService.getAllCourses();
        }
        
        // Get all specializations for the filter dropdown
        List<Specialization> specializations = specializationService.getAllSpecializations();
        
        model.addAttribute("courses", courses);
        model.addAttribute("specializations", specializations);
        model.addAttribute("selectedSpecializationId", specializationId);
        
        return "students/courses";
    }

    @GetMapping("/details")
    public String courseDetails(@RequestParam Long id, Model model) {
        Course course = courseService.getCourseById(id);
        
        if (course == null) {
            return "redirect:/student/courses";
        }
        
        model.addAttribute("course", course);
        
        return "students/course-details";
    }
}
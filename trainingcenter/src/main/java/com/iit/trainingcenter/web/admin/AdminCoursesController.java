package com.iit.trainingcenter.web.admin;

import com.iit.trainingcenter.entity.Course;
import com.iit.trainingcenter.service.CourseService;
import com.iit.trainingcenter.service.SpecializationService;
import com.iit.trainingcenter.service.TrainerService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin/courses")
public class AdminCoursesController {

    private final CourseService courseService;
    private final TrainerService trainerService;
    private final SpecializationService specializationService;

    public AdminCoursesController(CourseService courseService, TrainerService trainerService, SpecializationService specializationService) {
        this.courseService = courseService;
        this.trainerService = trainerService;
        this.specializationService = specializationService;
    }

    @GetMapping
    public String list(Model model) {
        model.addAttribute("pageTitle", "Admin • Courses");
        model.addAttribute("courses", courseService.getAllCourses());
        return "admin/courses/list";
    }

    @GetMapping("/new")
    public String createForm(Model model) {
        model.addAttribute("pageTitle", "Admin • New Course");
        model.addAttribute("course", new Course());
        model.addAttribute("trainers", trainerService.getAllTrainers());
        model.addAttribute("specializations", specializationService.getAllSpecializations());
        return "admin/courses/form";
    }

    @PostMapping
    public String create(
            @Valid @ModelAttribute("course") Course course,
            BindingResult result,
            @RequestParam("trainerId") Long trainerId,
            @RequestParam("specializationId") Long specializationId,
            Model model,
            RedirectAttributes ra
    ) {
        if (result.hasErrors()) {
            model.addAttribute("pageTitle", "Admin • New Course");
            model.addAttribute("trainers", trainerService.getAllTrainers());
            model.addAttribute("specializations", specializationService.getAllSpecializations());
            return "admin/courses/form";
        }
        course.setTrainer(trainerService.getTrainerById(trainerId));
        course.setSpecialization(specializationService.getSpecializationById(specializationId));
        courseService.createCourse(course);
        ra.addFlashAttribute("flashSuccess", "Course created successfully");
        return "redirect:/admin/courses";
    }

    @GetMapping("/{id}")
    public String details(@PathVariable Long id, Model model) {
        model.addAttribute("pageTitle", "Admin • Course Details");
        model.addAttribute("course", courseService.getCourseById(id));
        return "admin/courses/details";
    }

    @GetMapping("/{id}/edit")
    public String editForm(@PathVariable Long id, Model model) {
        model.addAttribute("pageTitle", "Admin • Edit Course");
        model.addAttribute("course", courseService.getCourseById(id));
        model.addAttribute("trainers", trainerService.getAllTrainers());
        model.addAttribute("specializations", specializationService.getAllSpecializations());
        return "admin/courses/form";
    }

    @PostMapping("/{id}")
    public String update(
            @PathVariable Long id,
            @Valid @ModelAttribute("course") Course course,
            BindingResult result,
            @RequestParam("trainerId") Long trainerId,
            @RequestParam("specializationId") Long specializationId,
            Model model,
            RedirectAttributes ra
    ) {
        if (result.hasErrors()) {
            model.addAttribute("pageTitle", "Admin • Edit Course");
            model.addAttribute("trainers", trainerService.getAllTrainers());
            model.addAttribute("specializations", specializationService.getAllSpecializations());
            return "admin/courses/form";
        }
        course.setTrainer(trainerService.getTrainerById(trainerId));
        course.setSpecialization(specializationService.getSpecializationById(specializationId));
        course.setId(id);
        courseService.updateCourse(id, course);
        ra.addFlashAttribute("flashSuccess", "Course updated successfully");
        return "redirect:/admin/courses";
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id, RedirectAttributes ra) {
        courseService.deleteCourse(id);
        ra.addFlashAttribute("flashSuccess", "Course deleted successfully");
        return "redirect:/admin/courses";
    }
}

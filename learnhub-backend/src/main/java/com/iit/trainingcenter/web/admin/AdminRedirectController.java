package com.iit.trainingcenter.web.admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Convenience redirects for common singular URL typos.
 *
 * Example: /admin/student -> /admin/students
 */
@Controller
public class AdminRedirectController {

    @GetMapping("/admin/student")
    public String student() {
        return "redirect:/admin/students";
    }

    @GetMapping("/admin/trainer")
    public String trainer() {
        return "redirect:/admin/trainers";
    }

    @GetMapping("/admin/course")
    public String course() {
        return "redirect:/admin/courses";
    }

    @GetMapping("/admin/specialization")
    public String specialization() {
        return "redirect:/admin/specializations";
    }

    @GetMapping("/admin/enrollment")
    public String enrollment() {
        return "redirect:/admin/enrollments";
    }
}

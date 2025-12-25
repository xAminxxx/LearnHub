package com.iit.trainingcenter.controller;

import com.iit.trainingcenter.service.StudentGroupService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class StudentGroupController {

    private final StudentGroupService studentGroupService;

    public StudentGroupController(StudentGroupService studentGroupService) {
        this.studentGroupService = studentGroupService;
    }

    @GetMapping("/groups")
    public String listGroups(Model model) {
        model.addAttribute("groups", studentGroupService.getAllGroups());
        return "groups/list";
    }
}
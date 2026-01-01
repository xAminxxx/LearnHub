package com.iit.trainingcenter.web.admin;

import com.iit.trainingcenter.entity.Specialization;
import com.iit.trainingcenter.service.SpecializationService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin/specializations")
public class AdminSpecializationsController {

    private final SpecializationService specializationService;

    public AdminSpecializationsController(SpecializationService specializationService) {
        this.specializationService = specializationService;
    }

    @GetMapping
    public String list(Model model) {
        model.addAttribute("pageTitle", "Admin • Specializations");
        model.addAttribute("specializations", specializationService.getAllSpecializations());
        return "admin/specializations/list";
    }

    @GetMapping("/new")
    public String createForm(Model model) {
        model.addAttribute("pageTitle", "Admin • New Specialization");
        model.addAttribute("specialization", new Specialization());
        return "admin/specializations/form";
    }

    @PostMapping
    public String create(
            @Valid @ModelAttribute("specialization") Specialization specialization,
            BindingResult result,
            Model model,
            RedirectAttributes ra
    ) {
        if (result.hasErrors()) {
            model.addAttribute("pageTitle", "Admin • New Specialization");
            return "admin/specializations/form";
        }
        specializationService.createSpecialization(specialization);
        ra.addFlashAttribute("flashSuccess", "Specialization created successfully");
        return "redirect:/admin/specializations";
    }

    @GetMapping("/{id}/edit")
    public String editForm(@PathVariable Long id, Model model) {
        model.addAttribute("pageTitle", "Admin • Edit Specialization");
        model.addAttribute("specialization", specializationService.getSpecializationById(id));
        return "admin/specializations/form";
    }

    @PostMapping("/{id}")
    public String update(
            @PathVariable Long id,
            @Valid @ModelAttribute("specialization") Specialization specialization,
            BindingResult result,
            Model model,
            RedirectAttributes ra
    ) {
        if (result.hasErrors()) {
            model.addAttribute("pageTitle", "Admin • Edit Specialization");
            return "admin/specializations/form";
        }
        specializationService.updateSpecialization(id, specialization);
        ra.addFlashAttribute("flashSuccess", "Specialization updated successfully");
        return "redirect:/admin/specializations";
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id, RedirectAttributes ra) {
        specializationService.deleteSpecialization(id);
        ra.addFlashAttribute("flashSuccess", "Specialization deleted successfully");
        return "redirect:/admin/specializations";
    }
}

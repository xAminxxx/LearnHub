package com.iit.trainingcenter.web.admin;

import com.iit.trainingcenter.dto.TrainerUpsertRequest;
import com.iit.trainingcenter.entity.Trainer;
import com.iit.trainingcenter.service.SpecializationService;
import com.iit.trainingcenter.service.TrainerService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin/trainers")
public class AdminTrainersController {

    private final TrainerService trainerService;
    private final SpecializationService specializationService;

    public AdminTrainersController(TrainerService trainerService, SpecializationService specializationService) {
        this.trainerService = trainerService;
        this.specializationService = specializationService;
    }

    @GetMapping
    public String list(Model model) {
        model.addAttribute("pageTitle", "Admin • Trainers");
        model.addAttribute("trainers", trainerService.getAllTrainers());
        return "admin/trainers/list";
    }

    @GetMapping("/new")
    public String createForm(Model model) {
        model.addAttribute("pageTitle", "Admin • New Trainer");
        model.addAttribute("form", new TrainerUpsertRequest("", "", "", "", null, "", null));
        model.addAttribute("specializations", specializationService.getAllSpecializations());
        return "admin/trainers/form";
    }

    @PostMapping
    public String create(
            @Valid @ModelAttribute("form") TrainerUpsertRequest form,
            BindingResult result,
            Model model,
            RedirectAttributes ra
    ) {
        if (result.hasErrors()) {
            model.addAttribute("pageTitle", "Admin • New Trainer");
            model.addAttribute("specializations", specializationService.getAllSpecializations());
            return "admin/trainers/form";
        }
        trainerService.createTrainer(form);
        ra.addFlashAttribute("flashSuccess", "Trainer created successfully");
        return "redirect:/admin/trainers";
    }

    @GetMapping("/{id}")
    public String details(@PathVariable Long id, Model model) {
        Trainer trainer = trainerService.getTrainerById(id);
        model.addAttribute("pageTitle", "Admin • Trainer Details");
        model.addAttribute("trainer", trainer);
        return "admin/trainers/details";
    }

    @GetMapping("/{id}/edit")
    public String editForm(@PathVariable Long id, Model model) {
        Trainer trainer = trainerService.getTrainerById(id);
        TrainerUpsertRequest form = new TrainerUpsertRequest(
                trainer.getFirstName(),
                trainer.getLastName(),
                trainer.getEmail(),
                trainer.getPhone(),
                trainer.getHireDate(),
                trainer.getBio(),
                trainer.getSpecialization() != null ? trainer.getSpecialization().getId() : null
        );
        model.addAttribute("pageTitle", "Admin • Edit Trainer");
        model.addAttribute("trainerId", id);
        model.addAttribute("form", form);
        model.addAttribute("specializations", specializationService.getAllSpecializations());
        return "admin/trainers/form";
    }

    @PostMapping("/{id}")
    public String update(
            @PathVariable Long id,
            @Valid @ModelAttribute("form") TrainerUpsertRequest form,
            BindingResult result,
            Model model,
            RedirectAttributes ra
    ) {
        if (result.hasErrors()) {
            model.addAttribute("pageTitle", "Admin • Edit Trainer");
            model.addAttribute("trainerId", id);
            model.addAttribute("specializations", specializationService.getAllSpecializations());
            return "admin/trainers/form";
        }
        trainerService.updateTrainer(id, form);
        ra.addFlashAttribute("flashSuccess", "Trainer updated successfully");
        return "redirect:/admin/trainers";
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id, RedirectAttributes ra) {
        trainerService.deleteTrainer(id);
        ra.addFlashAttribute("flashSuccess", "Trainer deleted successfully");
        return "redirect:/admin/trainers";
    }
}

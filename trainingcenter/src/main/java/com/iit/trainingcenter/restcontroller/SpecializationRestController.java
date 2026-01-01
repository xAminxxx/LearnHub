package com.iit.trainingcenter.restcontroller;

import com.iit.trainingcenter.dto.DtoMapper;
import com.iit.trainingcenter.dto.SpecializationDto;
import com.iit.trainingcenter.entity.Specialization;
import com.iit.trainingcenter.service.SpecializationService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/specializations")
public class SpecializationRestController {

    private final SpecializationService specializationService;

    @GetMapping
    public List<SpecializationDto> getAllSpecializations() {
        return specializationService.getAllSpecializations().stream().map(DtoMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public SpecializationDto getSpecializationById(@PathVariable Long id) {
        return DtoMapper.toDto(specializationService.getSpecializationById(id));
    }

    @PostMapping
    public Specialization createSpecialization(@RequestBody Specialization specialization) {
        return specializationService.createSpecialization(specialization);
    }

    @PutMapping("/{id}")
    public Specialization updateSpecialization(@PathVariable Long id, @RequestBody Specialization specializationDetails) {
        return specializationService.updateSpecialization(id, specializationDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteSpecialization(@PathVariable Long id) {
        specializationService.deleteSpecialization(id);
    }
}

package com.iit.trainingcenter.restcontroller;

import com.iit.trainingcenter.dto.DtoMapper;
import com.iit.trainingcenter.dto.SpecializationDto;
import com.iit.trainingcenter.dto.request.SpecializationRequest;
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
    public SpecializationDto createSpecialization(@RequestBody SpecializationRequest request) {
        Specialization spec = new Specialization();
        spec.setName(request.name());
        spec.setDescription(request.description());
        return DtoMapper.toDto(specializationService.createSpecialization(spec));
    }

    @PutMapping("/{id}")
    public SpecializationDto updateSpecialization(@PathVariable Long id, @RequestBody SpecializationRequest request) {
        Specialization details = new Specialization();
        details.setName(request.name());
        details.setDescription(request.description());
        return DtoMapper.toDto(specializationService.updateSpecialization(id, details));
    }

    @DeleteMapping("/{id}")
    public void deleteSpecialization(@PathVariable Long id) {
        specializationService.deleteSpecialization(id);
    }
}

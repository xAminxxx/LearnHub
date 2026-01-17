package com.iit.trainingcenter.restcontroller;

import com.iit.trainingcenter.dto.DtoMapper;
import com.iit.trainingcenter.dto.TrainerDto;
import com.iit.trainingcenter.dto.request.TrainerRequest;
import com.iit.trainingcenter.service.TrainerService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/trainers")
public class TrainerRestController {

    private final TrainerService trainerService;

    @GetMapping
    public List<TrainerDto> getAllTrainers() {
        return trainerService.getAllTrainers().stream().map(DtoMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public TrainerDto getTrainerById(@PathVariable Long id) {
        return DtoMapper.toDto(trainerService.getTrainerById(id));
    }

    @PostMapping
    public TrainerDto createTrainer(@RequestBody TrainerRequest req) {
        return DtoMapper.toDto(trainerService.createTrainer(req));
    }

    @PutMapping("/{id}")
    public TrainerDto updateTrainer(@PathVariable Long id, @RequestBody TrainerRequest req) {
        return DtoMapper.toDto(trainerService.updateTrainer(id, req));
    }

    @DeleteMapping("/{id}")
    public void deleteTrainer(@PathVariable Long id) {
        trainerService.deleteTrainer(id);
    }
}

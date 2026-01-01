package com.iit.trainingcenter.service;

import com.iit.trainingcenter.dto.TrainerUpsertRequest;
import com.iit.trainingcenter.entity.Specialization;
import com.iit.trainingcenter.entity.Trainer;
import com.iit.trainingcenter.repository.SpecializationRepository;
import com.iit.trainingcenter.repository.TrainerRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import java.util.List;

@Service
public class TrainerService {

    private final TrainerRepository trainerRepository;
    private final SpecializationRepository specializationRepository;

    public TrainerService(TrainerRepository trainerRepository, SpecializationRepository specializationRepository) {
        this.trainerRepository = trainerRepository;
        this.specializationRepository = specializationRepository;
    }

    public List<Trainer> getAllTrainers() {
        return trainerRepository.findAll();
    }

    public Trainer getTrainerById(Long id) {
        return trainerRepository.findById(id).orElse(null);
    }

    public Trainer createTrainer(TrainerUpsertRequest req) {
        Trainer trainer = new Trainer();
        applyUpsert(trainer, req);
        return trainerRepository.save(trainer);
    }

    public Trainer updateTrainer(Long id, TrainerUpsertRequest req) {
        Trainer trainer = trainerRepository.findById(id).orElse(null);
        if (trainer != null) {
            applyUpsert(trainer, req);
            return trainerRepository.save(trainer);
        }
        return null;
    }

    private void applyUpsert(Trainer trainer, TrainerUpsertRequest req) {
        trainer.setFirstName(req.firstName());
        trainer.setLastName(req.lastName());
        trainer.setEmail(req.email());
        trainer.setPhone(req.phone());
        trainer.setHireDate(req.hireDate());
        trainer.setBio(req.bio());

        if (req.specializationId() == null) {
            throw new ResponseStatusException(BAD_REQUEST, "specializationId is required");
        }

        Specialization spec = specializationRepository.findById(req.specializationId())
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "Invalid specializationId: " + req.specializationId()));
        trainer.setSpecialization(spec);
    }

    public void deleteTrainer(Long id) {
        trainerRepository.deleteById(id);
    }
}

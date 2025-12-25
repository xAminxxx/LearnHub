package com.iit.trainingcenter.service;

import com.iit.trainingcenter.entity.Specialization;
import com.iit.trainingcenter.repository.SpecializationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SpecializationService {

    private final SpecializationRepository specializationRepository;

    public SpecializationService(SpecializationRepository specializationRepository) {
        this.specializationRepository = specializationRepository;
    }

    public List<Specialization> getAllSpecializations() {
        return specializationRepository.findAll();
    }

    public Specialization saveSpecialization(Specialization specialization) {
        return specializationRepository.save(specialization);
    }
}

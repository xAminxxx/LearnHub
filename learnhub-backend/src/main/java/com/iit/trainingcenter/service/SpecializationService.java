package com.iit.trainingcenter.service;

import com.iit.trainingcenter.entity.Specialization;
import com.iit.trainingcenter.repository.SpecializationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class SpecializationService {

    private final SpecializationRepository specializationRepository;

    public SpecializationService(SpecializationRepository specializationRepository) {
        this.specializationRepository = specializationRepository;
    }

    public List<Specialization> getAllSpecializations() {
        return specializationRepository.findAll();
    }

    public Specialization getSpecializationById(Long id) {
        return specializationRepository.findById(id).orElse(null);
    }

    @Transactional
    public Specialization createSpecialization(Specialization specialization) {
        return specializationRepository.save(specialization);
    }

    @Transactional
    public Specialization updateSpecialization(Long id, Specialization specializationDetails) {
        Specialization specialization = specializationRepository.findById(id).orElse(null);
        if (specialization != null) {
            specialization.setName(specializationDetails.getName());
            specialization.setDescription(specializationDetails.getDescription());
            return specializationRepository.save(specialization);
        }
        return null;
    }

    @Transactional
    public void deleteSpecialization(Long id) {
        specializationRepository.deleteById(id);
    }
}

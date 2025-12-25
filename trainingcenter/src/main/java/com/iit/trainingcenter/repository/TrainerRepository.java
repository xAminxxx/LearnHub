package com.iit.trainingcenter.repository;

import com.iit.trainingcenter.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    Trainer findByEmail(String email);
}

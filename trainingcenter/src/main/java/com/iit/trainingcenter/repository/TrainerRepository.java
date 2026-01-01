package com.iit.trainingcenter.repository;

import com.iit.trainingcenter.entity.Trainer;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    Trainer findByEmail(String email);

    @Override
    @EntityGraph(attributePaths = {"specialization"})
    List<Trainer> findAll();
}

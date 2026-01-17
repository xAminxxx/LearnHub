package com.iit.trainingcenter.repository;

import com.iit.trainingcenter.entity.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpecializationRepository extends JpaRepository<Specialization, Long> {
    Specialization findByName(String name);

    @Override
    @EntityGraph(attributePaths = { "courses", "students", "trainers" })
    List<Specialization> findAll();
}
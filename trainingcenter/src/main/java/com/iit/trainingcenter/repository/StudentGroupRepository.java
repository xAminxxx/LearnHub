package com.iit.trainingcenter.repository;

import com.iit.trainingcenter.entity.StudentGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentGroupRepository extends JpaRepository<StudentGroup, Long> {
    StudentGroup findByName(String name);
}
package com.iit.trainingcenter.service;

import com.iit.trainingcenter.entity.StudentGroup;
import com.iit.trainingcenter.repository.StudentGroupRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudentGroupService {

    private final StudentGroupRepository studentGroupRepository;

    public StudentGroupService(StudentGroupRepository studentGroupRepository) {
        this.studentGroupRepository = studentGroupRepository;
    }

    public List<StudentGroup> getAllGroups() {
        return studentGroupRepository.findAll();
    }

    public StudentGroup saveGroup(StudentGroup group) {
        return studentGroupRepository.save(group);
    }

    public StudentGroup getGroupById(Long id) {
        return studentGroupRepository.findById(id).orElse(null);
    }
}
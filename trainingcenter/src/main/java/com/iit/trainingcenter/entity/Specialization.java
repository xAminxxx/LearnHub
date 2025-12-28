package com.iit.trainingcenter.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "specializations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Specialization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 500)
    private String description;

    @OneToMany(mappedBy = "specialization", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Course> courses = new ArrayList<>();

    @OneToMany(mappedBy = "specialization", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Student> students = new ArrayList<>();

    @OneToMany(mappedBy = "specialization", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Trainer> trainers = new ArrayList<>();

    public int getCourseCount() {
        return courses.size();
    }

    public int getStudentCount() {
        return students.size();
    }

    public int getTrainerCount() {
        return trainers.size();
    }
}

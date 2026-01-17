package com.iit.trainingcenter.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.util.HashSet;
import java.util.Set;

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
    @JsonManagedReference("course-specialization")
    @EqualsAndHashCode.Exclude
    private Set<Course> courses = new HashSet<>();

    @OneToMany(mappedBy = "specialization", cascade = CascadeType.ALL)
    @JsonManagedReference("student-specialization")
    @EqualsAndHashCode.Exclude
    private Set<Student> students = new HashSet<>();

    @OneToMany(mappedBy = "specialization", cascade = CascadeType.ALL)
    @JsonManagedReference("trainer-specialization")
    @EqualsAndHashCode.Exclude
    private Set<Trainer> trainers = new HashSet<>();

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

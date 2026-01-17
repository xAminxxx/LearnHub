package com.iit.trainingcenter.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    // DB compatibility: some existing schemas use `title` instead of `name`.
    // Keeping the Java property as `name` avoids breaking the codebase while
    // ensuring Hibernate writes to the required `title` column.
    @Column(name = "title", nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(name = "credit", nullable = false)
    private int credit;

    @Column(nullable = false)
    private int maxStudents;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", nullable = false)
    @JsonBackReference("course-trainer")
    @EqualsAndHashCode.Exclude
    private Trainer trainer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialization_id", nullable = false)
    @JsonBackReference("course-specialization")
    @EqualsAndHashCode.Exclude
    private Specialization specialization;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("course-enrollment")
    private List<Enrollment> enrollments = new ArrayList<>();

    public String getFullName() {
        return code + " - " + name;
    }

    public int getEnrolledStudentsCount() {
        return (int) enrollments.stream()
                .filter(e -> e.getStatus() == EnrollmentStatus.ACTIVE)
                .count();
    }

    public boolean isAvailable() {
        return getEnrolledStudentsCount() < maxStudents;
    }
}

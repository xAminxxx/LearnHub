package com.iit.trainingcenter.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trainers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private LocalDate hireDate;

    @Column(length = 1000)
    private String bio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialization_id", nullable = false)
    private Specialization specialization;

    @OneToMany(mappedBy = "trainer", cascade = CascadeType.ALL)
    private List<Course> courses = new ArrayList<>();

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public int getCourseCount() {
        return courses.size();
    }

    public int getStudentCount() {
        return courses.stream()
                .mapToInt(c -> c.getEnrollments().size())
                .sum();
    }
}

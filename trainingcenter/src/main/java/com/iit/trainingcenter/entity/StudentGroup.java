package com.iit.trainingcenter.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "student_groups")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private Integer year;

    @Column(length = 500)
    private String description;

    @OneToMany(mappedBy = "studentGroup", cascade = CascadeType.ALL)
    private List<Student> students = new ArrayList<>();

    public int getStudentCount() {
        return students.size();
    }

    public String getFullName() {
        return name + " - Year " + year;
    }
}

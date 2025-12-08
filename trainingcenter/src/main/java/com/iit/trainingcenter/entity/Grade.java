package com.iit.trainingcenter.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "grades")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", nullable = false)
    private Trainer trainer;

    @Column(nullable = false)
    private Double value;

    @Column(nullable = false)
    private String type; // "EXAM", "QUIZ", "PROJECT", "PARTICIPATION"

    @Column(nullable = false)
    private LocalDate gradeDate;

    @Column(length = 500)
    private String comments;

    @Column(nullable = false)
    private Double coefficient = 1.0; // Weight of this grade

    @PrePersist
    protected void onCreate() {
        gradeDate = LocalDate.now();
    }

    public boolean isPassingGrade() {
        return value >= 12.0; // 12/20 is passing
    }

    public Double getWeightedValue() {
        return value * coefficient;
    }

    public String getGradeCategory() {
        if (value >= 18) {
            return "EXCELLENT";
        }
        if (value >= 16) {
            return "VERY_GOOD";
        }
        if (value >= 14) {
            return "GOOD";
        }
        if (value >= 12) {
            return "PASS";
        }
        return "FAIL";
    }
}

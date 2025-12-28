package com.iit.trainingcenter.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "enrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EnrollmentStatus status = EnrollmentStatus.ACTIVE;

    @Column(nullable = false)
    private LocalDateTime enrollmentDate;

    @Column
    private LocalDateTime completionDate;

    @Column(length = 500)
    private String notes;

    @Column
    @Min(0)
    @Max(20)
    private Double score; // Grade score 0-20

    @Column
    private String gradeType; // EXAM, QUIZ, PROJECT, PARTICIPATION

    @PrePersist
    protected void onCreate() {
        enrollmentDate = LocalDateTime.now();
    }

    public boolean isActive() {
        return status == EnrollmentStatus.ACTIVE;
    }

    public boolean isCompleted() {
        return status == EnrollmentStatus.COMPLETED;
    }

    public boolean isCancelled() {
        return status == EnrollmentStatus.CANCELLED;
    }

    public void cancel() {
        this.status = EnrollmentStatus.CANCELLED;
    }

    public void complete() {
        this.status = EnrollmentStatus.COMPLETED;
        this.completionDate = LocalDateTime.now();
    }
}

package com.iit.trainingcenter.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private LocalDate sessionDate;

    @Column(nullable = false)
    private String topic;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Boolean isCurrent = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public boolean isPast() {
        return sessionDate.isBefore(LocalDate.now());
    }

    public boolean isUpcoming() {
        return sessionDate.isAfter(LocalDate.now());
    }
}

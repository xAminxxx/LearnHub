package com.iit.trainingcenter.entity;

import jakarta.persistence.*;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private String dayOfWeek; // "MONDAY", "TUESDAY", etc.

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private String room; // Room number/name

    @Column(nullable = false)
    private String building; // Building name

    @Column(nullable = false)
    private Boolean isActive = true;

    public int getDurationMinutes() {
        return (int) java.time.temporal.ChronoUnit.MINUTES.between(startTime, endTime);
    }

    public String getFullLocation() {
        return building + " - Room " + room;
    }

    public boolean conflictsWith(Schedule other) {
        // Check if schedules are on the same day
        if (!this.dayOfWeek.equals(other.dayOfWeek)) {
            return false;
        }

        // Check if time slots overlap
        return !(this.endTime.isBefore(other.startTime)
                || this.startTime.isAfter(other.endTime));
    }

    public String getScheduleDisplay() {
        return dayOfWeek + " " + startTime + " - " + endTime
                + " at " + getFullLocation();
    }
}

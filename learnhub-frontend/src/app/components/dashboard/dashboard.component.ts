import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentService, CourseService, TrainerService, EnrollmentService } from '../../services';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = signal({
    students: 0,
    courses: 0,
    trainers: 0,
    enrollments: 0
  });
  loading = signal(true);
  today = new Date();

  constructor(
    private studentService: StudentService,
    private courseService: CourseService,
    private trainerService: TrainerService,
    private enrollmentService: EnrollmentService
  ) { }

  ngOnInit(): void {
    forkJoin({
      students: this.studentService.getAll(),
      courses: this.courseService.getAll(),
      trainers: this.trainerService.getAll(),
      enrollments: this.enrollmentService.getAll()
    }).subscribe({
      next: (results) => {
        this.stats.set({
          students: results.students.length,
          courses: results.courses.length,
          trainers: results.trainers.length,
          enrollments: results.enrollments.length
        });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}

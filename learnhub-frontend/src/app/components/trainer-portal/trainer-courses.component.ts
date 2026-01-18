import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService, EnrollmentService, TrainerService } from '../../services';
import { AuthService } from '../../services/auth.service';
import { Course, Enrollment, Trainer } from '../../models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-trainer-courses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trainer-courses.component.html',
  styleUrls: ['./trainer-courses.component.css']
})
export class TrainerCoursesComponent implements OnInit {
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private trainerService = inject(TrainerService);

  loading = signal(true);
  courses = signal<Course[]>([]);
  allEnrollments = signal<Enrollment[]>([]);
  currentTrainer = signal<Trainer | null>(null);

  currentUser = this.authService.currentUser;

  // My courses (filtered by trainer)
  myCourses = computed(() => {
    const trainer = this.currentTrainer();
    if (!trainer) return [];
    return this.courses().filter((c: Course) => c.trainer?.id === trainer.id);
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    forkJoin({
      courses: this.courseService.getAll(),
      enrollments: this.enrollmentService.getAll(),
      trainers: this.trainerService.getAll()
    }).subscribe({
      next: (results) => {
        this.courses.set(results.courses);
        this.allEnrollments.set(results.enrollments);

        // Find current trainer
        const username = this.currentUser()?.username?.toLowerCase() || '';
        const userEmail = this.currentUser()?.email?.toLowerCase() || '';

        let trainer = results.trainers.find((t: Trainer) => {
          const trainerEmail = t.email?.toLowerCase() || '';
          const trainerFullName = (t.firstName + ' ' + t.lastName).toLowerCase();
          const trainerFirstName = t.firstName?.toLowerCase() || '';

          return (
            trainerEmail === userEmail ||
            trainerEmail.split('@')[0] === username ||
            trainerEmail.includes(username) ||
            trainerFirstName === username ||
            trainerFullName.includes(username) ||
            (username.length > 2 && trainerFirstName.includes(username))
          );
        });

        if (!trainer && this.currentUser()?.role === 'TRAINER' && results.trainers.length > 0) {
          trainer = results.trainers[0];
        }

        this.currentTrainer.set(trainer || null);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getEnrollmentCount(courseId: number): number {
    return this.allEnrollments().filter((e: Enrollment) => e.courseId === courseId && e.status === 'ACTIVE').length;
  }

  getPendingGradesCount(courseId: number): number {
    return this.allEnrollments().filter((e: Enrollment) => 
      e.courseId === courseId && e.status === 'ACTIVE' && e.score === null
    ).length;
  }

  getCompletedCount(courseId: number): number {
    return this.allEnrollments().filter((e: Enrollment) => e.courseId === courseId && e.status === 'COMPLETED').length;
  }
}

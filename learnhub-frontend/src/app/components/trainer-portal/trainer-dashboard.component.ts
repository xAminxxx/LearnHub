import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService, EnrollmentService, TrainerService } from '../../services';
import { AuthService } from '../../services/auth.service';
import { Course, Enrollment, Trainer } from '../../models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-trainer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trainer-dashboard.component.html',
  styleUrls: ['./trainer-dashboard.component.css']
})
export class TrainerDashboardComponent implements OnInit {
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
    return this.courses().filter(c => c.trainer?.id === trainer.id);
  });

  // Enrollments for my courses
  myEnrollments = computed(() => {
    const myCourseIds = this.myCourses().map(c => c.id);
    return this.allEnrollments().filter(e => myCourseIds.includes(e.courseId));
  });

  // Stats
  stats = computed(() => ({
    totalCourses: this.myCourses().length,
    totalStudents: this.myEnrollments().filter(e => e.status === 'ACTIVE').length,
    pendingGrades: this.myEnrollments().filter(e => e.status === 'ACTIVE' && e.score === null).length,
    completedStudents: this.myEnrollments().filter(e => e.status === 'COMPLETED').length
  }));

  // Recent enrollments in my courses
  recentEnrollments = computed(() => 
    this.myEnrollments()
      .filter(e => e.status === 'ACTIVE')
      .slice(0, 5)
  );

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

        // Find current trainer by matching username to trainer email/name
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

        // Fallback: If no match and user role is TRAINER, use first available trainer for demo
        if (!trainer && this.currentUser()?.role === 'TRAINER' && results.trainers.length > 0) {
          console.warn('No exact trainer match found. Using first trainer for demo purposes.');
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

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'bg-success';
      case 'COMPLETED': return 'bg-primary';
      case 'CANCELLED': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }
}

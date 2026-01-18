import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CourseService, EnrollmentService, TrainerService } from '../../services';
import { AuthService } from '../../services/auth.service';
import { Course, Enrollment, Trainer } from '../../models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-trainer-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trainer-course-detail.component.html',
  styleUrls: ['./trainer-course-detail.component.css']
})
export class TrainerCourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private trainerService = inject(TrainerService);

  loading = signal(true);
  course = signal<Course | null>(null);
  enrollments = signal<Enrollment[]>([]);
  currentTrainer = signal<Trainer | null>(null);
  filterStatus = signal<'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ALL');

  currentUser = this.authService.currentUser;

  // Filtered enrollments
  filteredEnrollments = computed(() => {
    const status = this.filterStatus();
    if (status === 'ALL') return this.enrollments();
    return this.enrollments().filter((e: Enrollment) => e.status === status);
  });

  // Stats
  stats = computed(() => ({
    total: this.enrollments().length,
    active: this.enrollments().filter((e: Enrollment) => e.status === 'ACTIVE').length,
    completed: this.enrollments().filter((e: Enrollment) => e.status === 'COMPLETED').length,
    cancelled: this.enrollments().filter((e: Enrollment) => e.status === 'CANCELLED').length,
    pending: this.enrollments().filter((e: Enrollment) => e.status === 'ACTIVE' && e.score === null).length
  }));

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadData(+courseId);
    }
  }

  loadData(courseId: number): void {
    this.loading.set(true);

    forkJoin({
      course: this.courseService.getById(courseId),
      enrollments: this.enrollmentService.getAll(),
      trainers: this.trainerService.getAll()
    }).subscribe({
      next: (results) => {
        this.course.set(results.course);

        // Filter enrollments for this course
        const courseEnrollments = results.enrollments.filter((e: Enrollment) => e.courseId === courseId);
        this.enrollments.set(courseEnrollments);

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

  setFilter(status: 'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'): void {
    this.filterStatus.set(status);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'bg-success';
      case 'COMPLETED': return 'bg-primary';
      case 'CANCELLED': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }

  goBack(): void {
    this.router.navigate(['/trainer/courses']);
  }
}

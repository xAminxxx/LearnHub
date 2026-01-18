import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService, EnrollmentService, TrainerService } from '../../services';
import { AuthService } from '../../services/auth.service';
import { Course, Enrollment, Trainer } from '../../models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-trainer-students',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trainer-students.component.html',
  styleUrls: ['./trainer-students.component.css']
})
export class TrainerStudentsComponent implements OnInit {
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private trainerService = inject(TrainerService);

  loading = signal(true);
  courses = signal<Course[]>([]);
  allEnrollments = signal<Enrollment[]>([]);
  currentTrainer = signal<Trainer | null>(null);
  selectedCourse = signal<number | null>(null);

  currentUser = this.authService.currentUser;

  // My courses
  myCourses = computed(() => {
    const trainer = this.currentTrainer();
    if (!trainer) return [];
    return this.courses().filter((c: Course) => c.trainer?.id === trainer.id);
  });

  // Enrollments for my courses
  myEnrollments = computed(() => {
    const myCourseIds = this.myCourses().map((c: Course) => c.id);
    return this.allEnrollments().filter((e: Enrollment) => myCourseIds.includes(e.courseId));
  });

  // Filtered by selected course
  filteredEnrollments = computed(() => {
    const courseId = this.selectedCourse();
    if (!courseId) return this.myEnrollments();
    return this.myEnrollments().filter((e: Enrollment) => e.courseId === courseId);
  });

  // Unique students (deduplicated by studentId)
  uniqueStudents = computed(() => {
    const seen = new Set<number>();
    return this.filteredEnrollments().filter((e: Enrollment) => {
      if (seen.has(e.studentId)) return false;
      seen.add(e.studentId);
      return true;
    });
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

  selectCourse(courseId: number | null): void {
    this.selectedCourse.set(courseId);
  }

  getCourseName(courseId: number): string {
    const course = this.courses().find((c: Course) => c.id === courseId);
    return course?.title || 'Unknown Course';
  }

  getCourseCode(courseId: number): string {
    const course = this.courses().find((c: Course) => c.id === courseId);
    return course?.code || '';
  }

  getStudentEnrollments(studentId: number): Enrollment[] {
    return this.myEnrollments().filter((e: Enrollment) => e.studentId === studentId);
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

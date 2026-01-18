import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService, EnrollmentService, TrainerService } from '../../services';
import { AuthService } from '../../services/auth.service';
import { Course, Enrollment, Trainer } from '../../models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-trainer-grades',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './trainer-grades.component.html',
  styleUrls: ['./trainer-grades.component.css']
})
export class TrainerGradesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private trainerService = inject(TrainerService);

  loading = signal(true);
  saving = signal<number | null>(null);
  course = signal<Course | null>(null);
  enrollments = signal<Enrollment[]>([]);
  currentTrainer = signal<Trainer | null>(null);

  successMessage = signal('');
  errorMessage = signal('');

  // Grade types
  gradeTypes = ['EXAM', 'PROJECT', 'ASSIGNMENT', 'QUIZ', 'FINAL'];

  currentUser = this.authService.currentUser;

  // Only show active enrollments for grading
  activeEnrollments = computed(() => 
    this.enrollments().filter((e: Enrollment) => e.status === 'ACTIVE')
  );

  // Stats
  stats = computed(() => ({
    total: this.activeEnrollments().length,
    graded: this.activeEnrollments().filter((e: Enrollment) => e.score !== undefined && e.score !== null).length,
    pending: this.activeEnrollments().filter((e: Enrollment) => e.score === undefined || e.score === null).length
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
        this.errorMessage.set('Failed to load course data.');
        this.loading.set(false);
      }
    });
  }

  saveGrade(enrollment: Enrollment, score: number | null, gradeType: string, notes: string): void {
    if (score !== null && (score < 0 || score > 100)) {
      this.errorMessage.set('Score must be between 0 and 100.');
      return;
    }

    this.saving.set(enrollment.id);
    this.errorMessage.set('');
    this.successMessage.set('');

    // Convert null to undefined for API compatibility
    const scoreValue = score === null ? undefined : score;
    const gradeTypeValue = gradeType || undefined;
    const notesValue = notes || undefined;

    const updateData = {
      studentId: enrollment.studentId,
      courseId: enrollment.courseId,
      enrollmentDate: enrollment.enrollmentDate,
      status: enrollment.status,
      score: scoreValue,
      gradeType: gradeTypeValue,
      notes: notesValue
    };

    this.enrollmentService.update(enrollment.id, updateData).subscribe({
      next: () => {
        this.successMessage.set(`Grade saved for ${enrollment.studentName}!`);
        // Update local state
        this.enrollments.update((enrollments: Enrollment[]) =>
          enrollments.map((e: Enrollment) =>
            e.id === enrollment.id 
              ? { ...e, score: scoreValue, gradeType: gradeTypeValue, notes: notesValue } 
              : e
          )
        );
        this.saving.set(null);

        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err: any) => {
        this.errorMessage.set(err.error?.message || 'Failed to save grade.');
        this.saving.set(null);
      }
    });
  }

  markAsCompleted(enrollment: Enrollment): void {
    if (enrollment.score === undefined || enrollment.score === null) {
      this.errorMessage.set('Please assign a grade before marking as completed.');
      return;
    }

    if (!confirm(`Mark ${enrollment.studentName} as COMPLETED? This will finalize their grade.`)) {
      return;
    }

    this.saving.set(enrollment.id);
    this.errorMessage.set('');

    const updateData = {
      studentId: enrollment.studentId,
      courseId: enrollment.courseId,
      enrollmentDate: enrollment.enrollmentDate,
      status: 'COMPLETED',
      score: enrollment.score,
      gradeType: enrollment.gradeType,
      notes: enrollment.notes
    };

    this.enrollmentService.update(enrollment.id, updateData).subscribe({
      next: () => {
        this.successMessage.set(`${enrollment.studentName} marked as COMPLETED!`);
        this.enrollments.update((enrollments: Enrollment[]) =>
          enrollments.map((e: Enrollment) =>
            e.id === enrollment.id 
              ? { ...e, status: 'COMPLETED' as const } 
              : e
          )
        );
        this.saving.set(null);

        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err: any) => {
        this.errorMessage.set(err.error?.message || 'Failed to update status.');
        this.saving.set(null);
      }
    });
  }

  goBack(): void {
    const courseId = this.course()?.id;
    if (courseId) {
      this.router.navigate(['/trainer/courses', courseId]);
    } else {
      this.router.navigate(['/trainer/courses']);
    }
  }

  getScoreClass(score: number | null | undefined): string {
    if (score === null || score === undefined) return '';
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-warning';
    return 'text-danger';
  }
}

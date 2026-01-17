import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StudentService, CourseService, EnrollmentService } from '../../services';
import { Enrollment, Student, Course } from '../../models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-enrollment-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './enrollment-detail.component.html'
})
export class EnrollmentDetailComponent implements OnInit {
  enrollment = signal<Enrollment | null>(null);
  loading = signal(true);
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFullEnrollment(+id);
    }
  }

  loadFullEnrollment(id: number): void {
    this.loading.set(true);
    this.enrollmentService.getById(id).subscribe({
      next: (e) => {
        // Now fetch student and course
        forkJoin({
          student: this.studentService.getById(e.studentId),
          course: this.courseService.getById(e.courseId)
        }).subscribe({
          next: (results) => {
            const fullEnrollment = {
              ...e,
              student: results.student,
              course: results.course
            };
            this.enrollment.set(fullEnrollment as Enrollment);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Failed to load related data', err);
            this.enrollment.set(e); // Set partial data at least
            this.loading.set(false);
          }
        });
      },
      error: (err) => {
        this.errorMessage.set('Failed to load enrollment details.');
        this.loading.set(false);
      }
    });
  }

  getStatusBadgeClass(status: string | undefined): string {
    if (!status) return 'bg-secondary';
    switch (status) {
      case 'ACTIVE': return 'bg-primary';
      case 'COMPLETED': return 'bg-success';
      case 'CANCELLED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}

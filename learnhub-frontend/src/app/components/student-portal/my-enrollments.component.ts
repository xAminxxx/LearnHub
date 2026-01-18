import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EnrollmentService, StudentService } from '../../services';
import { AuthService } from '../../services/auth.service';
import { Enrollment, Student } from '../../models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-my-enrollments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-enrollments.component.html',
  styleUrls: ['./my-enrollments.component.css']
})
export class MyEnrollmentsComponent implements OnInit {
  private authService = inject(AuthService);
  private enrollmentService = inject(EnrollmentService);
  private studentService = inject(StudentService);

  loading = signal(true);
  cancelling = signal<number | null>(null);
  enrollments = signal<Enrollment[]>([]);
  currentStudent = signal<Student | null>(null);
  activeFilter = signal<'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ALL');

  successMessage = signal('');
  errorMessage = signal('');

  currentUser = this.authService.currentUser;

  // Filtered enrollments based on status filter
  filteredEnrollments = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'ALL') {
      return this.enrollments();
    }
    return this.enrollments().filter(e => e.status === filter);
  });

  // Stats
  stats = computed(() => ({
    total: this.enrollments().length,
    active: this.enrollments().filter(e => e.status === 'ACTIVE').length,
    completed: this.enrollments().filter(e => e.status === 'COMPLETED').length,
    cancelled: this.enrollments().filter(e => e.status === 'CANCELLED').length
  }));

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    forkJoin({
      enrollments: this.enrollmentService.getAll(),
      students: this.studentService.getAll()
    }).subscribe({
      next: (results) => {
        // Find current student by matching username to student email/name
        const username = this.currentUser()?.username?.toLowerCase() || '';
        const userEmail = this.currentUser()?.email?.toLowerCase() || '';
        
        // Try multiple matching strategies
        let student = results.students.find((s: Student) => {
          const studentEmail = s.email?.toLowerCase() || '';
          const studentFullName = (s.firstName + ' ' + s.lastName).toLowerCase();
          const studentFirstName = s.firstName?.toLowerCase() || '';
          
          return (
            // Exact email match
            studentEmail === userEmail ||
            // Username matches student email prefix (before @)
            studentEmail.split('@')[0] === username ||
            // Username is contained in email
            studentEmail.includes(username) ||
            // Username matches first name
            studentFirstName === username ||
            // Full name contains username
            studentFullName.includes(username) ||
            // Username contains student's first name (for cases like "student" matching any)
            (username.length > 2 && studentFirstName.includes(username))
          );
        });

        // Fallback: If no match and user role is STUDENT, use first available student for demo
        if (!student && this.currentUser()?.role === 'STUDENT' && results.students.length > 0) {
          console.warn('No exact student match found. Using first student for demo purposes.');
          student = results.students[0];
        }

        this.currentStudent.set(student || null);

        // Filter enrollments for current user
        const userEnrollments = student
          ? results.enrollments.filter((e: Enrollment) => e.studentId === student!.id)
          : [];
        this.enrollments.set(userEnrollments);

        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load enrollments. Please try again.');
        this.loading.set(false);
      }
    });
  }

  setFilter(filter: 'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'): void {
    this.activeFilter.set(filter);
  }

  cancelEnrollment(enrollment: Enrollment): void {
    if (!confirm(`Are you sure you want to cancel your enrollment in "${enrollment.course?.title || enrollment.courseCode}"?`)) {
      return;
    }

    this.cancelling.set(enrollment.id);
    this.errorMessage.set('');
    this.successMessage.set('');

    const updateData = {
      ...enrollment,
      status: 'CANCELLED'
    };

    this.enrollmentService.update(enrollment.id, updateData).subscribe({
      next: () => {
        this.successMessage.set(`Enrollment in "${enrollment.course?.title || enrollment.courseCode}" has been cancelled.`);
        // Update local state
        this.enrollments.update(enrollments =>
          enrollments.map(e =>
            e.id === enrollment.id ? { ...e, status: 'CANCELLED' as const } : e
          )
        );
        this.cancelling.set(null);

        // Clear success message after 5 seconds
        setTimeout(() => this.successMessage.set(''), 5000);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to cancel enrollment. Please try again.');
        this.cancelling.set(null);
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

  getStatusIcon(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'bi-play-circle';
      case 'COMPLETED': return 'bi-check-circle';
      case 'CANCELLED': return 'bi-x-circle';
      default: return 'bi-circle';
    }
  }
}

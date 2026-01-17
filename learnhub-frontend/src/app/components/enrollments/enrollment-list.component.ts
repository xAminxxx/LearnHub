import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EnrollmentService } from '../../services';
import { Enrollment } from '../../models';

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './enrollment-list.component.html',
  styleUrls: ['./enrollment-list.component.css']
})
export class EnrollmentListComponent implements OnInit {
  enrollments = signal<Enrollment[]>([]);
  searchTerm = signal<string>('');
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');

  filteredEnrollments = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.enrollments();
    return this.enrollments().filter(e => 
      e.studentName.toLowerCase().includes(term) || 
      e.courseCode.toLowerCase().includes(term) ||
      e.status.toLowerCase().includes(term)
    );
  });

  constructor(private enrollmentService: EnrollmentService) { }

  ngOnInit(): void {
    this.loadEnrollments();
  }

  loadEnrollments(): void {
    this.loading.set(true);
    this.enrollmentService.getAll().subscribe({
      next: (data: Enrollment[]) => {
        this.enrollments.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.errorMessage.set('Failed to load enrollments. Error: ' + (err.message || 'Unknown error'));
        this.loading.set(false);
      }
    });
  }

  deleteEnrollment(id: number): void {
    if (confirm('Are you sure you want to delete this enrollment?')) {
      this.enrollmentService.delete(id).subscribe({
        next: () => {
          this.loadEnrollments();
        },
        error: (err: any) => {
          alert('Failed to delete enrollment: ' + err.message);
        }
      });
    }
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  editEnrollment(enrollment: Enrollment): void {
    console.log('Edit enrollment:', enrollment);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'bg-success';
      case 'COMPLETED': return 'bg-primary';
      case 'CANCELLED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}

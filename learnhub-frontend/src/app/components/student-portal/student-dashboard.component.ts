import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService, EnrollmentService, StudentService } from '../../services';
import { AuthService } from '../../services/auth.service';
import { Course, Enrollment } from '../../models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private studentService = inject(StudentService);

  loading = signal(true);
  courses = signal<Course[]>([]);
  myEnrollments = signal<Enrollment[]>([]);
  
  currentUser = this.authService.currentUser;

  // Computed stats
  stats = computed(() => ({
    totalCourses: this.courses().length,
    enrolledCourses: this.myEnrollments().filter((e: Enrollment) => e.status === 'ACTIVE').length,
    completedCourses: this.myEnrollments().filter(e => e.status === 'COMPLETED').length,
    availableCourses: this.courses().filter(c => 
      !this.myEnrollments().some(e => e.courseId === c.id && e.status !== 'CANCELLED')
    ).length
  }));

  // Recent enrollments (last 5)
  recentEnrollments = computed(() => 
    this.myEnrollments()
      .filter(e => e.status === 'ACTIVE')
      .slice(0, 5)
  );

  // Recommended courses (not enrolled, with available seats)
  recommendedCourses = computed(() => 
    this.courses()
      .filter(c => 
        !this.myEnrollments().some(e => e.courseId === c.id && e.status !== 'CANCELLED') &&
        (c.enrolledStudentsCount || 0) < c.maxStudents
      )
      .slice(0, 4)
  );

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    
    forkJoin({
      courses: this.courseService.getAll(),
      enrollments: this.enrollmentService.getAll(),
      students: this.studentService.getAll()
    }).subscribe({
      next: (results) => {
        this.courses.set(results.courses);
        
        // Find current student by matching username to student email/name
        const username = this.currentUser()?.username?.toLowerCase() || '';
        const userEmail = this.currentUser()?.email?.toLowerCase() || '';
        
        // Try multiple matching strategies
        let student = results.students.find((s: any) => {
          const studentEmail = s.email?.toLowerCase() || '';
          const studentFullName = (s.firstName + ' ' + s.lastName).toLowerCase();
          const studentFirstName = s.firstName?.toLowerCase() || '';
          
          return (
            studentEmail === userEmail ||
            studentEmail.split('@')[0] === username ||
            studentEmail.includes(username) ||
            studentFirstName === username ||
            studentFullName.includes(username) ||
            (username.length > 2 && studentFirstName.includes(username))
          );
        });

        // Fallback: If no match and user role is STUDENT, use first available student for demo
        if (!student && this.currentUser()?.role === 'STUDENT' && results.students.length > 0) {
          console.warn('No exact student match found. Using first student for demo purposes.');
          student = results.students[0];
        }

        // Filter enrollments for current user
        const userEnrollments = student
          ? results.enrollments.filter((e: Enrollment) => e.studentId === student.id)
          : results.enrollments.filter((e: Enrollment) => 
              e.studentName?.toLowerCase().includes(username)
            );
        this.myEnrollments.set(userEnrollments);
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

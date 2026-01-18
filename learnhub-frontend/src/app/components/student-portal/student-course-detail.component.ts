import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CourseService, EnrollmentService, StudentService } from '../../services';
import { AuthService } from '../../services/auth.service';
import { Course, Enrollment, Student } from '../../models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-student-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-course-detail.component.html',
  styleUrls: ['./student-course-detail.component.css']
})
export class StudentCourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private studentService = inject(StudentService);

  loading = signal(true);
  enrolling = signal(false);
  course = signal<Course | null>(null);
  myEnrollment = signal<Enrollment | null>(null);
  currentStudent = signal<Student | null>(null);
  
  successMessage = signal('');
  errorMessage = signal('');

  currentUser = this.authService.currentUser;

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
      students: this.studentService.getAll()
    }).subscribe({
      next: (results) => {
        this.course.set(results.course);

        // Find current student by matching username to student email/name
        const username = this.currentUser()?.username?.toLowerCase() || '';
        const userEmail = this.currentUser()?.email?.toLowerCase() || '';
        
        // Try multiple matching strategies
        let student = results.students.find((s: Student) => {
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

        this.currentStudent.set(student || null);

        // Find enrollment for this course
        if (student) {
          const enrollment = results.enrollments.find((e: Enrollment) => 
            e.studentId === student!.id && e.courseId === courseId
          );
          this.myEnrollment.set(enrollment || null);
        }

        this.loading.set(false);
      },
      error: (err: any) => {
        this.errorMessage.set('Failed to load course details.');
        this.loading.set(false);
      }
    });
  }

  get isEnrolled(): boolean {
    const enrollment = this.myEnrollment();
    return enrollment !== null && enrollment.status !== 'CANCELLED';
  }

  get canEnroll(): boolean {
    const course = this.course();
    return !this.isEnrolled && 
           course !== null &&
           (course.enrolledStudentsCount || 0) < course.maxStudents &&
           this.currentStudent() !== null;
  }

  enrollInCourse(): void {
    const course = this.course();
    const student = this.currentStudent();

    if (!course || !student || !this.canEnroll) {
      return;
    }

    this.enrolling.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const enrollmentData = {
      studentId: student.id,
      courseId: course.id,
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    };

    this.enrollmentService.create(enrollmentData).subscribe({
      next: (enrollment) => {
        this.successMessage.set(`Successfully enrolled in "${course.title}"!`);
        this.myEnrollment.set(enrollment);
        // Update course enrolled count
        this.course.update(c => c ? { 
          ...c, 
          enrolledStudentsCount: (c.enrolledStudentsCount || 0) + 1 
        } : null);
        this.enrolling.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to enroll. Please try again.');
        this.enrolling.set(false);
      }
    });
  }

  getAvailabilityPercentage(): number {
    const course = this.course();
    if (!course) return 0;
    return ((course.enrolledStudentsCount || 0) / course.maxStudents) * 100;
  }

  getAvailabilityClass(): string {
    const percentage = this.getAvailabilityPercentage();
    if (percentage >= 90) return 'bg-danger';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-success';
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
    this.router.navigate(['/student/courses']);
  }
}

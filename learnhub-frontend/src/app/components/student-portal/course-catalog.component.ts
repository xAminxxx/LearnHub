import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService, EnrollmentService } from '../../services';
import { AuthService } from '../../services/auth.service';
import { StudentService } from '../../services/student.service';
import { Course, Enrollment, Student } from '../../models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-course-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './course-catalog.component.html',
  styleUrls: ['./course-catalog.component.css']
})
export class CourseCatalogComponent implements OnInit {
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private studentService = inject(StudentService);

  loading = signal(true);
  enrolling = signal<number | null>(null); // Track which course is being enrolled
  courses = signal<Course[]>([]);
  myEnrollments = signal<Enrollment[]>([]);
  students = signal<Student[]>([]);
  currentStudent = signal<Student | null>(null);
  
  searchTerm = signal('');
  selectedSpecialization = signal<string>('');
  
  successMessage = signal('');
  errorMessage = signal('');

  currentUser = this.authService.currentUser;

  // Get unique specializations from courses
  specializations = computed(() => {
    const specs = this.courses()
      .map(c => c.specialization?.name)
      .filter((name): name is string => !!name);
    return [...new Set(specs)];
  });

  // Filtered courses based on search and specialization
  filteredCourses = computed(() => {
    let result = this.courses();
    
    const term = this.searchTerm().toLowerCase();
    if (term) {
      result = result.filter(c =>
        c.title.toLowerCase().includes(term) ||
        c.code.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term) ||
        c.trainer?.firstName?.toLowerCase().includes(term) ||
        c.trainer?.lastName?.toLowerCase().includes(term)
      );
    }

    const spec = this.selectedSpecialization();
    if (spec) {
      result = result.filter(c => c.specialization?.name === spec);
    }

    return result;
  });

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
        this.students.set(results.students);
        
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

        // Filter enrollments for current user
        const userEnrollments = student 
          ? results.enrollments.filter((e: Enrollment) => e.studentId === student!.id)
          : [];
        this.myEnrollments.set(userEnrollments);
        
        this.loading.set(false);
      },
      error: (err: any) => {
        this.errorMessage.set('Failed to load courses. Please try again.');
        this.loading.set(false);
      }
    });
  }

  isEnrolled(courseId: number): boolean {
    return this.myEnrollments().some(e => 
      e.courseId === courseId && e.status !== 'CANCELLED'
    );
  }

  canEnroll(course: Course): boolean {
    return !this.isEnrolled(course.id) && 
           (course.enrolledStudentsCount || 0) < course.maxStudents &&
           this.currentStudent() !== null;
  }

  getEnrollmentStatus(courseId: number): string | null {
    const enrollment = this.myEnrollments().find(e => e.courseId === courseId);
    return enrollment?.status || null;
  }

  enrollInCourse(course: Course): void {
    const student = this.currentStudent();
    
    if (!student) {
      this.errorMessage.set('Could not find your student profile. Please contact an administrator.');
      return;
    }

    if (!this.canEnroll(course)) {
      return;
    }

    this.enrolling.set(course.id);
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
        // Update local state
        this.myEnrollments.update(enrollments => [...enrollments, enrollment]);
        // Update course enrolled count
        this.courses.update(courses => 
          courses.map(c => 
            c.id === course.id 
              ? { ...c, enrolledStudentsCount: (c.enrolledStudentsCount || 0) + 1 }
              : c
          )
        );
        this.enrolling.set(null);
        
        // Clear success message after 5 seconds
        setTimeout(() => this.successMessage.set(''), 5000);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to enroll. Please try again.');
        this.enrolling.set(null);
      }
    });
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedSpecialization.set('');
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  onSpecializationChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedSpecialization.set(target.value);
  }

  getAvailabilityPercentage(course: Course): number {
    return ((course.enrolledStudentsCount || 0) / course.maxStudents) * 100;
  }

  getAvailabilityClass(course: Course): string {
    const percentage = this.getAvailabilityPercentage(course);
    if (percentage >= 90) return 'bg-danger';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-success';
  }
}

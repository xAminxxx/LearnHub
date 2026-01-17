import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EnrollmentService, StudentService, CourseService } from '../../services';
import { Student, Course } from '../../models';

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './enrollment-form.component.html'
})
export class EnrollmentFormComponent implements OnInit {
  enrollmentForm: FormGroup;
  isEditMode = signal(false);
  loading = signal(false);
  submitting = signal(false);
  students = signal<Student[]>([]);
  courses = signal<Course[]>([]);
  enrollmentId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.enrollmentForm = this.fb.group({
      studentId: [null, [Validators.required]],
      courseId: [null, [Validators.required]],
      enrollmentDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      status: ['ACTIVE', [Validators.required]],
      score: [null, [Validators.min(0), Validators.max(20)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadMetadata();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.enrollmentId = +params['id'];
        this.isEditMode.set(true);
        this.loadEnrollment(this.enrollmentId);
      }
    });
  }

  loadMetadata(): void {
    this.studentService.getAll().subscribe(data => this.students.set(data));
    this.courseService.getAll().subscribe(data => this.courses.set(data));
  }

  loadEnrollment(id: number): void {
    this.loading.set(true);
    this.enrollmentService.getById(id).subscribe({
      next: (enrollment) => {
        this.enrollmentForm.patchValue({
          studentId: enrollment.student?.id,
          courseId: enrollment.course?.id,
          enrollmentDate: enrollment.enrollmentDate,
          status: enrollment.status,
          score: enrollment.score,
          notes: enrollment.notes
        });
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load enrollment', err);
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.enrollmentForm.invalid) {
      this.enrollmentForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const formData = this.enrollmentForm.value;

    if (this.isEditMode()) {
      this.enrollmentService.update(this.enrollmentId!, formData).subscribe({
        next: () => this.router.navigate(['/enrollments']),
        error: (err) => {
          console.error('Update failed', err);
          this.submitting.set(false);
        }
      });
    } else {
      this.enrollmentService.create(formData).subscribe({
        next: () => this.router.navigate(['/enrollments']),
        error: (err) => {
          console.error('Creation failed', err);
          this.submitting.set(false);
        }
      });
    }
  }
}

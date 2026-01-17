import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentService, SpecializationService } from '../../services';
import { Specialization } from '../../models';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './student-form.component.html'
})
export class StudentFormComponent implements OnInit {
  studentForm: FormGroup;
  isEditMode = signal(false);
  loading = signal(false);
  submitting = signal(false);
  specializations = signal<Specialization[]>([]);
  studentId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private specializationService: SpecializationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.studentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      enrollmentDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      specializationId: [null]
    });
  }

  ngOnInit(): void {
    this.loadSpecializations();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.studentId = +params['id'];
        this.isEditMode.set(true);
        this.loadStudent(this.studentId);
      }
    });
  }

  loadSpecializations(): void {
    this.specializationService.getAll().subscribe({
      next: (data) => this.specializations.set(data),
      error: (err) => console.error('Failed to load specializations', err)
    });
  }

  loadStudent(id: number): void {
    this.loading.set(true);
    this.studentService.getById(id).subscribe({
      next: (student) => {
        this.studentForm.patchValue({
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          phone: student.phone,
          birthDate: student.birthDate,
          enrollmentDate: student.enrollmentDate,
          specializationId: student.specialization?.id
        });
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load student', err);
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const formData = this.studentForm.value;

    if (this.isEditMode()) {
      this.studentService.update(this.studentId!, formData).subscribe({
        next: () => this.router.navigate(['/students']),
        error: (err) => {
          console.error('Update failed', err);
          this.submitting.set(false);
        }
      });
    } else {
      this.studentService.create(formData).subscribe({
        next: () => this.router.navigate(['/students']),
        error: (err) => {
          console.error('Creation failed', err);
          this.submitting.set(false);
        }
      });
    }
  }
}

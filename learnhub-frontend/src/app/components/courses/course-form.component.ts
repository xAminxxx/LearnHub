import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService, TrainerService, SpecializationService } from '../../services';
import { Trainer, Specialization } from '../../models';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './course-form.component.html'
})
export class CourseFormComponent implements OnInit {
  courseForm: FormGroup;
  isEditMode = signal(false);
  loading = signal(false);
  submitting = signal(false);
  trainers = signal<Trainer[]>([]);
  specializations = signal<Specialization[]>([]);
  courseId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private trainerService: TrainerService,
    private specializationService: SpecializationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.courseForm = this.fb.group({
      code: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      credit: [3, [Validators.required, Validators.min(1)]],
      maxStudents: [30, [Validators.required, Validators.min(1)]],
      trainerId: [null, [Validators.required]],
      specializationId: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadMetadata();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.courseId = +params['id'];
        this.isEditMode.set(true);
        this.loadCourse(this.courseId);
      }
    });
  }

  loadMetadata(): void {
    this.trainerService.getAll().subscribe(data => this.trainers.set(data));
    this.specializationService.getAll().subscribe(data => this.specializations.set(data));
  }

  loadCourse(id: number): void {
    this.loading.set(true);
    this.courseService.getById(id).subscribe({
      next: (course) => {
        this.courseForm.patchValue({
          code: course.code,
          title: course.title,
          description: course.description,
          credit: course.credit,
          maxStudents: course.maxStudents,
          trainerId: course.trainer?.id,
          specializationId: course.specialization?.id
        });
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load course', err);
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const formData = this.courseForm.value;

    if (this.isEditMode()) {
      this.courseService.update(this.courseId!, formData).subscribe({
        next: () => this.router.navigate(['/courses']),
        error: (err) => {
          console.error('Update failed', err);
          this.submitting.set(false);
        }
      });
    } else {
      this.courseService.create(formData).subscribe({
        next: () => this.router.navigate(['/courses']),
        error: (err) => {
          console.error('Creation failed', err);
          this.submitting.set(false);
        }
      });
    }
  }
}

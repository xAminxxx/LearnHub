import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TrainerService, SpecializationService } from '../../services';
import { Specialization } from '../../models';

@Component({
  selector: 'app-trainer-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './trainer-form.component.html'
})
export class TrainerFormComponent implements OnInit {
  trainerForm: FormGroup;
  isEditMode = signal(false);
  loading = signal(false);
  submitting = signal(false);
  specializations = signal<Specialization[]>([]);
  trainerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private trainerService: TrainerService,
    private specializationService: SpecializationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.trainerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      hireDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      bio: [''],
      specializationId: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadSpecializations();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.trainerId = +params['id'];
        this.isEditMode.set(true);
        this.loadTrainer(this.trainerId);
      }
    });
  }

  loadSpecializations(): void {
    this.specializationService.getAll().subscribe(data => this.specializations.set(data));
  }

  loadTrainer(id: number): void {
    this.loading.set(true);
    this.trainerService.getById(id).subscribe({
      next: (trainer) => {
        this.trainerForm.patchValue({
          firstName: trainer.firstName,
          lastName: trainer.lastName,
          email: trainer.email,
          phone: trainer.phone,
          hireDate: trainer.hireDate,
          bio: trainer.bio,
          specializationId: trainer.specialization?.id
        });
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load trainer', err);
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.trainerForm.invalid) {
      this.trainerForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const formData = this.trainerForm.value;

    if (this.isEditMode()) {
      this.trainerService.update(this.trainerId!, formData).subscribe({
        next: () => this.router.navigate(['/trainers']),
        error: (err) => {
          console.error('Update failed', err);
          this.submitting.set(false);
        }
      });
    } else {
      this.trainerService.create(formData).subscribe({
        next: () => this.router.navigate(['/trainers']),
        error: (err) => {
          console.error('Creation failed', err);
          this.submitting.set(false);
        }
      });
    }
  }
}

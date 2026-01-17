import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SpecializationService } from '../../services';

@Component({
  selector: 'app-specialization-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './specialization-form.component.html'
})
export class SpecializationFormComponent implements OnInit {
  specForm: FormGroup;
  isEditMode = signal(false);
  loading = signal(false);
  submitting = signal(false);
  specId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private specService: SpecializationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.specForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.specId = +params['id'];
        this.isEditMode.set(true);
        this.loadSpec(this.specId);
      }
    });
  }

  loadSpec(id: number): void {
    this.loading.set(true);
    this.specService.getById(id).subscribe({
      next: (spec) => {
        this.specForm.patchValue({
          name: spec.name,
          description: spec.description
        });
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load specialization', err);
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.specForm.invalid) {
      this.specForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const formData = this.specForm.value;

    if (this.isEditMode()) {
      this.specService.update(this.specId!, formData).subscribe({
        next: () => this.router.navigate(['/specializations']),
        error: (err) => {
          console.error('Update failed', err);
          this.submitting.set(false);
        }
      });
    } else {
      this.specService.create(formData).subscribe({
        next: () => this.router.navigate(['/specializations']),
        error: (err) => {
          console.error('Creation failed', err);
          this.submitting.set(false);
        }
      });
    }
  }
}

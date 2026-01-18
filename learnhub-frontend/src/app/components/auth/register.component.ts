import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">
            <i class="bi bi-mortarboard-fill text-indigo"></i>
            LearnHub
          </h1>
          <p class="auth-subtitle">Create your account</p>
        </div>

        @if (errorMessage()) {
          <div class="alert alert-danger" role="alert">
            <i class="bi bi-x-circle me-2"></i>
            {{ errorMessage() }}
          </div>
        }

        @if (successMessage()) {
          <div class="alert alert-success" role="alert">
            <i class="bi bi-check-circle me-2"></i>
            {{ successMessage() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-person"></i>
              </span>
              <input
                type="text"
                class="form-control"
                id="username"
                name="username"
                [(ngModel)]="formData.username"
                required
                minlength="3"
                placeholder="Choose a username"
                [disabled]="isLoading()"
                #usernameInput="ngModel"
              />
            </div>
            @if (usernameInput.invalid && usernameInput.touched) {
              <small class="text-danger">Username must be at least 3 characters</small>
            }
          </div>

          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                class="form-control"
                id="email"
                name="email"
                [(ngModel)]="formData.email"
                required
                email
                placeholder="Enter your email"
                [disabled]="isLoading()"
                #emailInput="ngModel"
              />
            </div>
            @if (emailInput.invalid && emailInput.touched) {
              <small class="text-danger">Please enter a valid email address</small>
            }
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-lock"></i>
              </span>
              <input
                [type]="showPassword() ? 'text' : 'password'"
                class="form-control"
                id="password"
                name="password"
                [(ngModel)]="formData.password"
                required
                minlength="6"
                placeholder="Create a password"
                [disabled]="isLoading()"
                #passwordInput="ngModel"
              />
              <button
                type="button"
                class="btn btn-outline-secondary"
                (click)="togglePassword()"
              >
                <i class="bi" [class.bi-eye]="!showPassword()" [class.bi-eye-slash]="showPassword()"></i>
              </button>
            </div>
            @if (passwordInput.invalid && passwordInput.touched) {
              <small class="text-danger">Password must be at least 6 characters</small>
            }
          </div>

          <div class="mb-4">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-lock-fill"></i>
              </span>
              <input
                [type]="showPassword() ? 'text' : 'password'"
                class="form-control"
                id="confirmPassword"
                name="confirmPassword"
                [(ngModel)]="confirmPassword"
                required
                placeholder="Confirm your password"
                [disabled]="isLoading()"
              />
            </div>
            @if (confirmPassword && formData.password !== confirmPassword) {
              <small class="text-danger">Passwords do not match</small>
            }
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100 btn-lg"
            [disabled]="!registerForm.valid || formData.password !== confirmPassword || isLoading()"
          >
            @if (isLoading()) {
              <span class="spinner-border spinner-border-sm me-2" role="status"></span>
              Creating account...
            } @else {
              <i class="bi bi-person-plus me-2"></i>
              Create Account
            }
          </button>
        </form>

        <div class="auth-footer">
          <p class="mb-0">
            Already have an account?
            <a routerLink="/login" class="text-indigo">Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .auth-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      padding: 2.5rem;
      width: 100%;
      max-width: 420px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .auth-subtitle {
      color: #64748b;
      margin: 0;
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
    }

    .form-label {
      font-weight: 500;
      color: #334155;
    }

    .input-group-text {
      background-color: #f8fafc;
      border-right: none;
    }

    .input-group .form-control {
      border-left: none;
    }

    .input-group .form-control:focus {
      border-color: #ced4da;
      box-shadow: none;
    }

    .input-group:focus-within {
      box-shadow: 0 0 0 0.25rem rgba(79, 70, 229, 0.25);
      border-radius: 0.375rem;
    }

    .input-group:focus-within .input-group-text,
    .input-group:focus-within .form-control {
      border-color: #4f46e5;
    }
  `]
})
export class RegisterComponent {
  formData: RegisterRequest = { username: '', password: '', email: '' };
  confirmPassword = '';
  
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  showPassword = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (!this.formData.username || !this.formData.password || !this.formData.email) {
      return;
    }

    if (this.formData.password !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.register(this.formData).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        this.successMessage.set('Account created successfully! Redirecting to login...');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.error?.message || 'Registration failed. Please try again.'
        );
      }
    });
  }
}

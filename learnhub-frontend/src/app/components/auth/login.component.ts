import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
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
          <p class="auth-subtitle">Sign in to your account</p>
        </div>

        @if (sessionExpired()) {
          <div class="alert alert-warning" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>
            Your session has expired. Please log in again.
          </div>
        }

        @if (errorMessage()) {
          <div class="alert alert-danger" role="alert">
            <i class="bi bi-x-circle me-2"></i>
            {{ errorMessage() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
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
                [(ngModel)]="credentials.username"
                required
                placeholder="Enter your username"
                [disabled]="isLoading()"
              />
            </div>
          </div>

          <div class="mb-4">
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
                [(ngModel)]="credentials.password"
                required
                placeholder="Enter your password"
                [disabled]="isLoading()"
              />
              <button
                type="button"
                class="btn btn-outline-secondary"
                (click)="togglePassword()"
              >
                <i class="bi" [class.bi-eye]="!showPassword()" [class.bi-eye-slash]="showPassword()"></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100 btn-lg"
            [disabled]="!loginForm.valid || isLoading()"
          >
            @if (isLoading()) {
              <span class="spinner-border spinner-border-sm me-2" role="status"></span>
              Signing in...
            } @else {
              <i class="bi bi-box-arrow-in-right me-2"></i>
              Sign In
            }
          </button>
        </form>

        <div class="auth-footer">
          <p class="mb-0">
            Don't have an account?
            <a routerLink="/register" class="text-indigo">Register here</a>
          </p>
        </div>

        <div class="demo-credentials">
          <p class="text-muted small mb-2">Demo Credentials:</p>
          <div class="d-flex gap-2 flex-wrap justify-content-center">
            <button class="btn btn-sm btn-outline-secondary" (click)="fillDemo('admin', 'admin123')">
              Admin
            </button>
            <button class="btn btn-sm btn-outline-secondary" (click)="fillDemo('trainer', 'trainer123')">
              Trainer
            </button>
            <button class="btn btn-sm btn-outline-secondary" (click)="fillDemo('student', 'student123')">
              Student
            </button>
          </div>
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

    .demo-credentials {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px dashed #e2e8f0;
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
export class LoginComponent {
  credentials: LoginRequest = { username: '', password: '' };
  
  isLoading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);
  sessionExpired = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Check for session expired flag
    this.route.queryParams.subscribe(params => {
      this.sessionExpired.set(params['sessionExpired'] === 'true');
    });
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  fillDemo(username: string, password: string): void {
    this.credentials = { username, password };
  }

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          // Get return URL or default to dashboard
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
          this.router.navigateByUrl(returnUrl);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.status === 401 
            ? 'Invalid username or password' 
            : 'An error occurred. Please try again.'
        );
      }
    });
  }
}

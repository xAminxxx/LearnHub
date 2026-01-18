import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-card">
        <div class="icon-wrapper">
          <i class="bi bi-shield-lock-fill"></i>
        </div>
        <h1>Access Denied</h1>
        <p class="text-muted">
          You don't have permission to access this page.
          Please contact your administrator if you believe this is an error.
        </p>
        <div class="d-flex gap-3 justify-content-center">
          <a routerLink="/dashboard" class="btn btn-primary">
            <i class="bi bi-house me-2"></i>
            Go to Dashboard
          </a>
          <a routerLink="/login" class="btn btn-outline-secondary">
            <i class="bi bi-box-arrow-in-right me-2"></i>
            Login as Different User
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f8fafc;
      padding: 1rem;
    }

    .unauthorized-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      padding: 3rem;
      text-align: center;
      max-width: 500px;
    }

    .icon-wrapper {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    .icon-wrapper i {
      font-size: 2.5rem;
      color: white;
    }

    h1 {
      color: #1e293b;
      margin-bottom: 1rem;
    }

    p {
      margin-bottom: 2rem;
    }
  `]
})
export class UnauthorizedComponent {}

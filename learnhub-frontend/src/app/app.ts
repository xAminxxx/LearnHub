import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Auth state
  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;
  isStudent = this.authService.isStudent;
  isAdmin = this.authService.isAdmin;
  isTrainer = this.authService.isTrainer;
  
  // Computed display name
  displayName = computed(() => {
    const user = this.currentUser();
    return user?.username || 'Guest';
  });

  // Check if current route is auth page
  isAuthRoute = computed(() => {
    const authRoutes = ['/login', '/register', '/unauthorized'];
    return authRoutes.includes(this.router.url);
  });

  // Check if current route is student portal
  isStudentRoute = computed(() => {
    return this.router.url.startsWith('/student');
  });

  logout(): void {
    this.authService.logout();
  }
}

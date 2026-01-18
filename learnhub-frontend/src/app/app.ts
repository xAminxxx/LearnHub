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

  logout(): void {
    this.authService.logout();
  }
}

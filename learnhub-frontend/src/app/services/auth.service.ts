import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse, User, DecodedToken } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private apiUrl = `${environment.apiUrl}/auth`;

  // Reactive state using signals
  private currentUserSignal = signal<User | null>(this.getUserFromStorage());
  private isAuthenticatedSignal = signal<boolean>(this.hasValidToken());

  // Public computed values
  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => this.isAuthenticatedSignal());
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'ADMIN');
  readonly isTrainer = computed(() => this.currentUserSignal()?.role === 'TRAINER');
  readonly isStudent = computed(() => this.currentUserSignal()?.role === 'STUDENT');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check token validity on service init
    this.checkTokenValidity();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.token) {
          this.setToken(response.token);
          const user = this.decodeTokenToUser(response.token);
          if (user) {
            // Try to get existing user info from storage (preserves role from registration)
            const existingUser = this.getUserFromStorage();
            if (existingUser && existingUser.username === user.username) {
              // Preserve the role from previous session
              user.role = existingUser.role;
            }
            this.setUser(user);
          }
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, data).pipe(
      tap(user => {
        // Store the user with their role from the registration response
        // This ensures we have the correct role when they log in
        if (user) {
          this.setUser(user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.isAuthenticatedSignal.set(true);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decoded = this.decodeToken(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  private checkTokenValidity(): void {
    if (!this.hasValidToken()) {
      this.logout();
    }
  }

  private decodeToken(token: string): DecodedToken {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }

  private decodeTokenToUser(token: string): User | null {
    try {
      const decoded = this.decodeToken(token);
      const username = decoded.sub;
      
      // Determine role from token claims or infer from demo usernames
      let role: 'ADMIN' | 'TRAINER' | 'STUDENT' = 'STUDENT';
      
      // Check if role is in the token (some backends include it)
      if (decoded.role) {
        role = decoded.role as 'ADMIN' | 'TRAINER' | 'STUDENT';
      } else if (decoded.roles && Array.isArray(decoded.roles) && decoded.roles.length > 0) {
        // Some backends use "roles" array with "ROLE_" prefix
        const tokenRole = decoded.roles[0].replace('ROLE_', '');
        if (['ADMIN', 'TRAINER', 'STUDENT'].includes(tokenRole)) {
          role = tokenRole as 'ADMIN' | 'TRAINER' | 'STUDENT';
        }
      } else {
        // Fallback: infer role from demo usernames
        const lowerUsername = username.toLowerCase();
        if (lowerUsername === 'admin' || lowerUsername.includes('admin')) {
          role = 'ADMIN';
        } else if (lowerUsername === 'trainer' || lowerUsername.includes('trainer')) {
          role = 'TRAINER';
        } else if (lowerUsername === 'student' || lowerUsername.includes('student')) {
          role = 'STUDENT';
        }
      }
      
      return {
        id: 0, // Not available in token
        username: username,
        email: '', // Not available in token
        role: role,
        enabled: true
      };
    } catch {
      return null;
    }
  }

  // Check if user has any of the specified roles
  hasRole(...roles: string[]): boolean {
    const user = this.currentUserSignal();
    return user ? roles.includes(user.role) : false;
  }

  // Update user role (useful for admin testing different views)
  updateUserRole(role: 'ADMIN' | 'TRAINER' | 'STUDENT'): void {
    const user = this.currentUserSignal();
    if (user) {
      const updatedUser = { ...user, role };
      this.setUser(updatedUser);
    }
  }
}

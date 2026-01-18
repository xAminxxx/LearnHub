export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'TRAINER' | 'STUDENT';
  enabled: boolean;
}

export interface DecodedToken {
  sub: string;       // username
  iat: number;       // issued at
  exp: number;       // expiration
}

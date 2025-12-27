export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
  message: string;
  passwordExpired?: boolean;
  forcePasswordChange?: boolean;
}

export interface User {
  username: string;
  email: string;
  role: string;
  token: string;
}

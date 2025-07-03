export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // segundos
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>; // Para errores de validación
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

// Tipos para interceptores
export interface RequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, any>;
}
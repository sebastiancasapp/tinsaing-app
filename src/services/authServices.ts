import { LoginCredentials, AuthResponse, ApiError, User, AuthTokens } from '../types/auth';
import { API_CONFIG, TOKEN_CONFIG } from '../config/api';
import { httpClient } from '../utils/httpClient';

class AuthService {
  // Login con API real
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.LOGIN,
        credentials
      );

      // Guardar tokens y usuario
      this.storeAuthData(response);

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Registro de usuario
  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.REGISTER,
        userData
      );

      this.storeAuthData(response);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();

      if (refreshToken) {
        this.clearAuthData();
      }
    } catch (error) {
      console.warn('Error al hacer logout en el servidor:', error);
    } finally {
      //this.clearAuthData();
    }
  }

  // Refrescar token
  async refreshToken(): Promise<AuthTokens | null> {
    try {
      const refreshToken = this.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await httpClient.post<{ tokens: AuthTokens }>(
        API_CONFIG.ENDPOINTS.REFRESH,
        { refreshToken }
      );

      this.storeTokens(response.tokens);
      return response.tokens;
    } catch (error) {
      this.clearAuthData();
      throw this.handleError(error);
    }
  }

  // Obtener perfil del usuario
  async getProfile(): Promise<User> {
    try {
      const response = await httpClient.get<{ user: User }>(
        API_CONFIG.ENDPOINTS.PROFILE
      );

      // Actualizar usuario en localStorage
      this.storeUser(response.user);
      return response.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Verificar si el token está expirado
  isTokenExpired(): boolean {
    const expiry = localStorage.getItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
    if (!expiry) return true;

    return Date.now() > parseInt(expiry);
  }

  // Verificar autenticación
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired();
  }

  // Obtener token de acceso
  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
  }

  // Obtener refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
  }

  // Obtener usuario almacenado
  getStoredUser(): User | null {
    const user = localStorage.getItem(TOKEN_CONFIG.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Almacenar datos de autenticación
  private storeAuthData(authResponse: AuthResponse): void {
    this.storeTokens(authResponse.tokens);
    this.storeUser(authResponse.user);
  }

  // Almacenar tokens
  private storeTokens(tokens: AuthTokens): void {
    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, tokens.refreshToken);

    // Calcular tiempo de expiración
    const expiryTime = Date.now() + (tokens.expiresIn * 1000);
    localStorage.setItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  // Almacenar usuario
  private storeUser(user: User): void {
    localStorage.setItem(TOKEN_CONFIG.USER_KEY, JSON.stringify(user));
  }

  // Limpiar datos de autenticación
  private clearAuthData(): void {
    localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_CONFIG.USER_KEY);
    localStorage.removeItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
  }

  // Manejar errores
  private handleError(error: any): ApiError {
    if (error.status === 401) {
      this.clearAuthData();
      return { 
        message: 'Credenciales incorrectas o sesión expirada',
        code: 'UNAUTHORIZED',
        status: 401
      };
    }

    if (error.status === 422) {
      return {
        message: 'Datos de entrada inválidos',
        code: 'VALIDATION_ERROR',
        status: 422,
        errors: error.errors
      };
    }

    if (error.code === 'NETWORK_ERROR') {
      return {
        message: 'Error de conexión. Verifica tu internet.',
        code: 'NETWORK_ERROR'
      };
    }

    return {
      message: error.message || 'Error desconocido',
      code: error.code || 'UNKNOWN_ERROR',
      status: error.status
    };
  }

  // Configurar interceptor para refresh automático
  setupTokenRefresh(): void {
    setInterval(async () => {
      if (this.isAuthenticated() && this.isTokenExpired()) {
        try {
          await this.refreshToken();
        } catch (error) {
          console.warn('Error al refrescar token automáticamente:', error);
          this.clearAuthData();
        }
      }
    }, 60000); // Verificar cada minuto
  }
}

export const authService = new AuthService();

// Configurar refresh automático al importar
authService.setupTokenRefresh();
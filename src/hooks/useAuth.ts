import { useState } from 'react';
import { authService } from '../services/authServices';
import { LoginCredentials, ApiError } from '../types/auth';

interface UseAuthReturn {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    authService.isAuthenticated()
  );

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await authService.login(credentials);
      setIsAuthenticated(true);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setIsAuthenticated(false);
    setError(null);
  };

  return {
    login,
    logout,
    loading,
    error,
    isAuthenticated
  };
};
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginCredentials } from '../../types/auth';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { login, loading, error, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState<Partial<LoginCredentials>>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error de validación cuando el usuario empiece a escribir
    if (validationErrors[name as keyof LoginCredentials]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<LoginCredentials> = {};

    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Formato de email inválido';
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      // navigate('/dashboard');
      // Aquí puedes redirigir al dashboard o página principal
    } catch (err) {
      // El error ya se maneja en el hook useAuth
      console.error('Error en login:', err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div>
          <div style={{ textAlign: 'center', marginBottom: '11px' }}>
            <img alt="Logo" src="https://storage.googleapis.com/ccit_prod/static/media/logos/logo-tinsa.svg" data-kt-element="logo" style={{ height: "60px", marginBottom: "4px" }} />

            <div style={{ color: "oklch(0.554 0.046 257.417)", fontWeight: '600', fontSize: '20px' }}>
              Guia Producción
            </div>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>

            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`${styles.input} ${validationErrors.email ? styles.inputError : ''}`}
              placeholder="Email"
              autoComplete="email"
              autoFocus
            />
            {validationErrors.email && (
              <span className={styles.errorText}>{validationErrors.email}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>

            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`${styles.input} ${validationErrors.password ? styles.inputError : ''}`}
              placeholder="Contraseña"
              autoComplete="current-password"
            />
            {validationErrors.password && (
              <span className={styles.errorText}>{validationErrors.password}</span>
            )}
          </div>

          {error && (
            <div className={styles.serverError}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
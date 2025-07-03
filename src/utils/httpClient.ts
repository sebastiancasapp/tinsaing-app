import { API_CONFIG } from '../config/api';
import { ApiError, RequestConfig } from '../types/auth';

class HttpClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = API_CONFIG.HEADERS;
  }

  // Interceptor para agregar token automáticamente
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Método principal para hacer requests
  private async request<T>(config: RequestConfig): Promise<T> {
    const { url, method, data, params, headers = {} } = config;

    // Construir URL completa
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    // Agregar parámetros de query si existen
    const urlWithParams = params ? this.addQueryParams(fullUrl, params) : fullUrl;

    // Configurar headers
    const requestHeaders = {
      ...this.defaultHeaders,
      ...this.getAuthHeaders(),
      ...headers
    };

    // Configurar AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(urlWithParams, {
        method,
        headers: requestHeaders,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal
      });
      console.log("response", response)
      clearTimeout(timeoutId);

      // Manejar respuestas no exitosas
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Intentar parsear JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return response.text() as any;
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.handleRequestError(error);
    }
  }

  // Manejar errores de respuesta HTTP
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData: any = {};

    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    
    const apiError: ApiError = {
      message: errorData.message || 'Error en la petición',
      code: errorData.code,
      status: response.status,
      errors: errorData.errors
    };

    // Manejar token expirado
    if (response.status === 401) {
      this.handleUnauthorized();
    }

    throw apiError;
  }

  // Manejar errores de red/timeout
  private handleRequestError(error: any): ApiError {
    if(error.code){
        return {
          message: error.message || 'Error de conexión',
          code: error.code || 'NETWORK_ERROR'
        }
    }
    
    if (error.name === 'AbortError') {
      return { message: 'Tiempo de espera agotado', code: 'TIMEOUT' };
    }

    if (!navigator.onLine) {
      return { message: 'Sin conexión a internet', code: 'NETWORK_ERROR' };
    }

    return {
      message: error.message || 'Error de conexión',
      code: 'NETWORK_ERROR'
    };
  }

  // Manejar token no autorizado
  private handleUnauthorized(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    // Redirigir al login si es necesario
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  // Agregar parámetros de query a URL
  private addQueryParams(url: string, params: Record<string, any>): string {
    const urlObj = new URL(url);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.append(key, String(value));
      }
    });
    return urlObj.toString();
  }

  // Métodos HTTP públicos
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>({ url, method: 'GET', params });
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ url, method: 'POST', data });
  }

  async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ url, method: 'PUT', data });
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>({ url, method: 'DELETE' });
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ url, method: 'PATCH', data });
  }
}

export const httpClient = new HttpClient();
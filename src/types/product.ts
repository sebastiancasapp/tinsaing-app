export interface Product {
  item: number;
  name: string;
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
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, any>;
}

// Interfaz para productos en la lista con cantidad
export interface ProductWithQuantity {
  item: number;
  name: string;
  quantity: number;
}

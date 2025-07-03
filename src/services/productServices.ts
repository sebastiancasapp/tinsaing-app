import { ApiError, Product, ProductWithQuantity } from "../types/product";
import { API_CONFIG, TOKEN_CONFIG } from "../config/api";
import { httpClient } from "../utils/httpClient";

class ProductService {
  async getProductsBySensitiveValue(
    value: string,
    signal: AbortSignal
  ): Promise<Product[]> {
    try {
      const response = await httpClient.get<Product[]>(
        `${API_CONFIG.ENDPOINTS.PRODUCTS}?value=${encodeURIComponent(value)}`,
        { signal }
      );

      // Guardar tokens y usuario

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProductionGuideByProducts(
    products: ProductWithQuantity[]
  ): Promise<any> {
    try {
      const response = await httpClient.post<Product[]>(
        `${API_CONFIG.ENDPOINTS.PRODUCTS}/production-guide`,
        {
          productQuantityList: products,
        }
      );

      // Guardar tokens y usuario

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Manejar errores
  private handleError(error: any): ApiError {
    if (error.status === 401) {
      return {
        message: "Credenciales incorrectas o sesión expirada",
        code: "UNAUTHORIZED",
        status: 401,
      };
    }

    if (error.status === 422) {
      return {
        message: "Datos de entrada inválidos",
        code: "VALIDATION_ERROR",
        status: 422,
        errors: error.errors,
      };
    }

    if (error.code === "NETWORK_ERROR") {
      return {
        message: "Error de conexión. Verifica tu internet.",
        code: "NETWORK_ERROR",
      };
    }

    return {
      message: error.message || "Error desconocido",
      code: error.code || "UNKNOWN_ERROR",
      status: error.status,
    };
  }
}

export const productService = new ProductService();

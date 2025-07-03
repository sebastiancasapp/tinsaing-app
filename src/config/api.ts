// Configuración de la API
export const API_CONFIG = {
  BASE_URL: import.meta.env.REACT_APP_API_URL || "http://localhost:3000/api/v1",
  ENDPOINTS: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
    REGISTER: "/auth/register",
    PRODUCTS: "/product",
  },
  TIMEOUT: 10000, // 10 segundos
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Configuración de tokens
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: "accessToken",
  REFRESH_TOKEN_KEY: "refreshToken",
  USER_KEY: "user",
  TOKEN_EXPIRY_KEY: "tokenExpiry",
};

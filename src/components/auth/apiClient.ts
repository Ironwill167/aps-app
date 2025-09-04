import axios from 'axios';
import { authService } from './authService';
import { AppConfig } from '../config';

// Create an axios instance
const apiClient = axios.create({
  baseURL: AppConfig.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'x-electron-app-secret': import.meta.env.VITE_REACT_APP_API_SECRET || 'apskeytoconnectelectron',
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from session storage first (current session)
    let storedAuth = sessionStorage.getItem('aps-session');

    // If not in session storage, check localStorage (remember me)
    if (!storedAuth) {
      storedAuth = localStorage.getItem('aps-auth');
    }

    if (storedAuth) {
      try {
        const { token } = JSON.parse(storedAuth);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error parsing stored auth:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await authService.refreshAccessToken();
      if (newToken) {
        // Set header and retry
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }

      // If refresh failed, clear storages and reload to show login
      sessionStorage.removeItem('aps-session');
      localStorage.removeItem('aps-auth');
      localStorage.removeItem('aps-remembered-credentials');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default apiClient;

import axios from 'axios';
import { AppConfig } from '../config';

// Create an axios instance
const apiClient = axios.create({
  baseURL: AppConfig.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'x-electron-app-secret': 'apskeytoconnectelectron',
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
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, clear all stored auth
      sessionStorage.removeItem('aps-session');
      localStorage.removeItem('aps-auth');
      localStorage.removeItem('aps-remembered-credentials');

      // Redirect to login by reloading the app
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default apiClient;

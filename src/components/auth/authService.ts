import { AppConfig } from '../config';

interface User {
  user_id: number;
  user_name: string;
  user_email: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

interface StoredAuth {
  token: string;
  user: User;
  rememberMe: boolean;
}

class AuthService {
  private readonly STORAGE_KEY = 'aps-auth';
  private readonly SESSION_KEY = 'aps-session';
  private readonly ELECTRON_SECRET =
    import.meta.env.VITE_REACT_APP_API_SECRET || 'apskeytoconnectelectron';

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${AppConfig.apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-electron-app-secret': this.ELECTRON_SECRET,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        return {
          success: true,
          message: 'Login successful',
          token: data.token,
          user: data.user,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Login failed',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${AppConfig.apiBaseUrl}/api/auth/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-electron-app-secret': this.ELECTRON_SECRET,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }

  storeAuth(token: string, user: User, rememberMe: boolean): void {
    const authData: StoredAuth = { token, user, rememberMe };

    // Always store in session storage for current session
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(authData));

    // Only store in localStorage if remember me is checked
    if (rememberMe) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData));
    }
  }

  getStoredAuth(): StoredAuth | null {
    try {
      // First check session storage for current session
      let stored = sessionStorage.getItem(this.SESSION_KEY);
      if (stored) {
        return JSON.parse(stored);
      }

      // Then check localStorage for persistent storage (remember me)
      stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const authData = JSON.parse(stored);
        // If found in localStorage, also set in session storage for this session
        sessionStorage.setItem(this.SESSION_KEY, stored);
        return authData;
      }

      return null;
    } catch (error) {
      console.error('Error reading stored auth:', error);
      return null;
    }
  }

  clearStoredAuth(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getAuthHeaders(token: string): Record<string, string> {
    return {
      Authorization: `Bearer ${token}`,
      'x-electron-app-secret': this.ELECTRON_SECRET,
      'Content-Type': 'application/json',
    };
  }
}

export const authService = new AuthService();

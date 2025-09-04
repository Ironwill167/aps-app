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
  refreshToken?: string;
  user?: User;
}

interface StoredAuth {
  token: string;
  refreshToken?: string;
  user: User;
  rememberMe: boolean;
}

class AuthService {
  private readonly STORAGE_KEY = 'aps-auth';
  private readonly SESSION_KEY = 'aps-session';
  private readonly ELECTRON_SECRET = import.meta.env.VITE_REACT_APP_API_SECRET;

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
          refreshToken: data.refreshToken,
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
    // Pull any existing refresh token (set during login)
    let existing: StoredAuth | null = null;
    try {
      const local = localStorage.getItem(this.STORAGE_KEY);
      if (local) existing = JSON.parse(local);
    } catch (e) {
      // ignore JSON parse errors
    }

    const authData: StoredAuth = { token, user, rememberMe, refreshToken: existing?.refreshToken };

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

  // Persist refresh token when available and rememberMe is true
  persistRefreshToken(refreshToken?: string, rememberMe?: boolean) {
    if (!refreshToken) return;
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const obj = JSON.parse(stored);
        obj.refreshToken = refreshToken;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(obj));
      } else if (rememberMe) {
        // If not present but remember me intended, create minimal entry
        const session = sessionStorage.getItem(this.SESSION_KEY);
        if (session) {
          const s = JSON.parse(session);
          s.refreshToken = refreshToken;
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(s));
        }
      }
    } catch (err) {
      console.error('Failed to persist refresh token', err);
    }
  }

  async refreshAccessToken(): Promise<string | null> {
    try {
      // Prefer localStorage (remember me) then session
      const stored =
        localStorage.getItem(this.STORAGE_KEY) || sessionStorage.getItem(this.SESSION_KEY);
      if (!stored) return null;
      const auth: StoredAuth = JSON.parse(stored);
      if (!auth.refreshToken) return null;

      const response = await fetch(`${AppConfig.apiBaseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-electron-app-secret': this.ELECTRON_SECRET,
        },
        body: JSON.stringify({ refreshToken: auth.refreshToken }),
      });

      if (!response.ok) return null;
      const data = await response.json();
      if (!data?.token) return null;

      // Update token in storages
      const updated: StoredAuth = { ...auth, token: data.token };
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(updated));
      if (auth.rememberMe) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
      }

      return data.token as string;
    } catch (err) {
      console.error('Error refreshing access token:', err);
      return null;
    }
  }
}

export const authService = new AuthService();

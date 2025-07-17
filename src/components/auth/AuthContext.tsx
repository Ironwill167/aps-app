import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { authService } from './authService';

interface User {
  user_id: number;
  user_name: string;
  user_email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  rememberMe: boolean;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; rememberMe: boolean } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESTORE_SESSION'; payload: { user: User; token: string; rememberMe: boolean } };

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
  rememberMe: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        rememberMe: action.payload.rememberMe,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        rememberMe: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        rememberMe: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        rememberMe: action.payload.rememberMe,
      };
    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on app start
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const storedAuth = authService.getStoredAuth();
        if (storedAuth) {
          const { token, user, rememberMe } = storedAuth;

          // Verify token is still valid
          const isValid = await authService.verifyToken(token);
          if (isValid) {
            dispatch({
              type: 'RESTORE_SESSION',
              payload: { user, token, rememberMe },
            });
            return;
          } else {
            // Token is invalid, clear storage
            authService.clearStoredAuth();
          }
        }

        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        console.error('Error checking existing session:', error);
        authService.clearStoredAuth();
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkExistingSession();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const result = await authService.login(email, password);

      if (result.success && result.user && result.token) {
        // Always store auth data (for session and optionally for persistence)
        authService.storeAuth(result.token, result.user, rememberMe);

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: result.user,
            token: result.token,
            rememberMe,
          },
        });

        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const logout = () => {
    authService.clearStoredAuth();
    dispatch({ type: 'LOGOUT' });
  };

  return <AuthContext.Provider value={{ state, login, logout }}>{children}</AuthContext.Provider>;
};

import React, { useReducer, useEffect, ReactNode } from 'react';
import { authService } from './authService';
import { AuthContext, authReducer, initialState } from './authTypes';

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

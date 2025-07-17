import React, { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { AppConfig } from '../config';
import logo from '../../assets/logotpbg.png';
import './Login.scss';

interface QuickLoginUser {
  email: string;
  name: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  // Load remembered credentials on component mount
  useEffect(() => {
    const remembered = localStorage.getItem('aps-remembered-credentials');
    if (remembered) {
      try {
        const { email: rememberedEmail, rememberMe: wasRemembered } = JSON.parse(remembered);
        if (wasRemembered) {
          setEmail(rememberedEmail);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading remembered credentials:', error);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(email, password, rememberMe);

      if (success) {
        // Store email for remember me functionality
        if (rememberMe) {
          localStorage.setItem(
            'aps-remembered-credentials',
            JSON.stringify({
              email,
              rememberMe: true,
            })
          );
        } else {
          localStorage.removeItem('aps-remembered-credentials');
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get quick login data from environment variables (development only)
  const getQuickLoginData = (): { users: QuickLoginUser[]; password: string } => {
    if (AppConfig.environment !== 'development') return { users: [], password: '' };

    const users = import.meta.env.VITE_DEV_QUICK_LOGIN_USERS?.split(',') || [];
    const names = import.meta.env.VITE_DEV_QUICK_LOGIN_NAMES?.split(',') || [];
    const password = import.meta.env.VITE_DEV_QUICK_LOGIN_PASSWORD || '';

    const quickLoginButtons: QuickLoginUser[] = users.map((email: string, index: number) => ({
      email: email.trim(),
      name: names[index]?.trim() || `User ${index + 1}`,
    }));

    return { users: quickLoginButtons, password };
  };

  const { users: quickLoginButtons, password: defaultPassword } = getQuickLoginData();

  const handleQuickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword(defaultPassword); // Use password from environment variables
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src={logo} alt="APS Logo" className="login-logo" />
          <h1>Welcome to APS</h1>
          <p>Please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <span className="checkmark"></span>
              Remember me
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Quick login section - only show in development */}
        {AppConfig.environment === 'development' && (
          <div className="quick-login-section">
            <p className="quick-login-title">Quick Login (Development)</p>
            <div className="quick-login-buttons">
              {quickLoginButtons.map((user: QuickLoginUser) => (
                <button
                  key={user.email}
                  type="button"
                  className="quick-login-btn"
                  onClick={() => handleQuickLogin(user.email)}
                  disabled={isLoading}
                >
                  {user.name}
                </button>
              ))}
            </div>
            <p className="quick-login-note">Default password: {defaultPassword}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

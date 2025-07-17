import React, { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import './Login.scss';

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

  const quickLoginButtons = [
    { email: 'aps@agprospec.co.za', name: 'APS' },
    { email: 'mannie@agprospec.co.za', name: 'Mannie' },
    { email: 'willie@agprospec.co.za', name: 'Willie' },
    { email: 'elize@agprospec.co.za', name: 'Elize' },
  ];

  const handleQuickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('APS@2025'); // Default password from JWT implementation
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src="/src/assets/logotpbg.png" alt="APS Logo" className="login-logo" />
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

        <div className="quick-login-section">
          <p className="quick-login-title">Quick Login (Development)</p>
          <div className="quick-login-buttons">
            {quickLoginButtons.map((user) => (
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
          <p className="quick-login-note">Default password: APS@2025</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React from 'react';
import { useAuth } from './useAuth';
import Login from './Login';
import './Loading.scss';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { state } = useAuth();

  // Show loading spinner while checking authentication
  if (state.isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!state.isAuthenticated) {
    return <Login />;
  }

  // Show protected content if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;

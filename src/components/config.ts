// Environment-based configuration
interface Config {
  apiBaseUrl: string;
  environment: 'development' | 'production';
  emailApiUrl: string;
}

// Get the current environment
const getEnvironment = (): 'development' | 'production' => {
  // Check if we're in development mode
  if (import.meta.env.MODE === 'development') {
    return 'development';
  }

  // Check for custom environment variable
  if (import.meta.env.VITE_REACT_APP_ENVIRONMENT === 'development') {
    return 'development';
  }

  // Check if running on localhost (development indicator)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'development';
  }

  // Default to production
  return 'production';
};

// Enhanced environment detection with manual override support
const getEnvironmentWithOverride = (): 'development' | 'production' => {
  // Check for manual override first
  const override = localStorage.getItem('aps-app-environment-override') as
    | 'development'
    | 'production'
    | null;
  if (override) {
    console.log(`🔧 Using environment override: ${override}`);
    return override;
  }

  return getEnvironment();
};

// Configuration for different environments
const environments = {
  development: {
    apiBaseUrl: import.meta.env.VITE_REACT_APP_DEV_API_URL || 'http://localhost:3000', // Fallback to localhost
    environment: 'development' as const,
    emailApiUrl: import.meta.env.VITE_REACT_APP_DEV_EMAIL_URL || 'http://localhost:3000/api', // Fallback to localhost
  },
  production: {
    apiBaseUrl: import.meta.env.VITE_REACT_APP_PROD_API_URL || 'https://your-production-server.com', // Set via environment
    environment: 'production' as const,
    emailApiUrl:
      import.meta.env.VITE_REACT_APP_PROD_EMAIL_URL || 'https://your-production-server.com/api', // Set via environment
  },
};

const config: Config = environments[getEnvironmentWithOverride()];

// Export the base URL for backward compatibility
export const BaseUrl = config.apiBaseUrl;

// Export the full config object for new functionality
export const AppConfig = config;

// Utility function to get the current environment
export const getCurrentEnvironment = getEnvironment;

// Utility function to manually override environment (for development/testing)
export const setEnvironmentOverride = (env: 'development' | 'production' | null) => {
  if (env) {
    localStorage.setItem('aps-app-environment-override', env);
    console.log(`🔧 Environment manually set to: ${env}`);
    console.log('🔄 Please refresh the page for changes to take effect.');
  } else {
    localStorage.removeItem('aps-app-environment-override');
    console.log('🔧 Environment override removed');
    console.log('🔄 Please refresh the page for changes to take effect.');
  }
};

// Debug logging (only in development)
if (config.environment === 'development') {
  console.log('🔧 Development Mode Active');
  console.log('📡 API Base URL:', config.apiBaseUrl);
  console.log('📧 Email API URL:', config.emailApiUrl);
} else {
  console.log('🚀 Production Mode Active');
}

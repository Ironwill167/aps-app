# Environment Configuration Guid### Backend URLs

- **Development**:
  - API: `http://192.168.8.59:3000`
  - Email: `http://192.168.8.59:3000`
- **Production**:
  - API: `http://102.211.206.54:3000`
  - Email: `http://102.211.206.54:3000`Overview

This app now supports two separate backend environments:

- **Development**: Local Ubuntu machine backend (default for localhost)
- **Production**: Live server backend (102.211.206.54:3000)

## Automatic Environment Detection

The app automatically detects the environment based on:

1. **NODE_ENV**: If set to 'development'
2. **REACT_APP_ENVIRONMENT**: If set to 'development'
3. **Hostname**: If running on localhost/127.0.0.1
4. **Default**: Falls back to production

## Configuration Files

### Environment Variables (.env)

Create a `.env` file in the root directory:

```bash
# For development
REACT_APP_ENVIRONMENT=development

# For production
REACT_APP_ENVIRONMENT=production
```

### Backend URLs

- **Development**:
  - API: `http://192.168.8.59:3000`
  - Email: `http://192.168.8.59:3001`
- **Production**:
  - API: `http://102.211.206.54:3000`
  - Email: `http://102.211.206.54:3001`

## Manual Environment Switching

### Using Browser Console

Open browser developer tools and use these commands:

```javascript
// Switch to development
setEnvironmentOverride('development');

// Switch to production
setEnvironmentOverride('production');

// Reset to automatic detection
setEnvironmentOverride(null);

// Check current environment
getCurrentEnvironment();
```

### Using Environment Switcher Component

Add this to your main app component during development:

```tsx
import EnvironmentSwitcher from './components/utils/EnvironmentSwitcher';

// In your main component render:
{
  process.env.NODE_ENV === 'development' && <EnvironmentSwitcher />;
}
```

## Setup Instructions

### 1. Development Environment (Local Ubuntu Machine)

1. Ensure your local backend is running on port 3000
2. Database should be accessible locally
3. All API endpoints should match the production structure

### 2. Production Environment (Live Server)

1. Ensure live server is accessible at 102.211.206.54:3000
2. Production database is connected
3. All production services are running

### 3. Building for Different Environments

#### Development Build:

```bash
REACT_APP_ENVIRONMENT=development npm run build
```

#### Production Build:

```bash
REACT_APP_ENVIRONMENT=production npm run build
```

## Email Configuration

Email API endpoints automatically switch based on environment:

- **Development**: `http://localhost:3000/api/send-email`
- **Production**: `http://102.211.206.54:3000/api/send-email`

## Troubleshooting

### Common Issues:

1. **API not accessible**: Check if backend is running on the correct port
2. **CORS errors**: Ensure backend allows requests from your frontend domain
3. **Database connection**: Verify database is accessible from the backend

### Debug Information:

The app logs current environment info to browser console:

```
🔧 Development Mode Active
📡 API Base URL: http://localhost:3000
📧 Email API URL: http://localhost:3000/api
```

### Network Issues:

- Development: Check if Ubuntu machine is accessible
- Production: Verify live server connectivity
- Firewall: Ensure ports 3000 are open

## Environment Override Persistence

Manual environment overrides are saved in localStorage and persist across browser sessions until cleared.

## Best Practices

1. **Development**: Always test on local environment first
2. **Staging**: Use manual override to test production APIs locally
3. **Production**: Remove environment switcher component from builds
4. **Security**: Never expose sensitive credentials in frontend code

## File Locations

- Configuration: `/src/components/config.ts`
- Environment Example: `/.env.example`
- Switcher Component: `/src/components/utils/EnvironmentSwitcher.tsx`
- Email Service: `/src/components/Emails/EmailModal.tsx`

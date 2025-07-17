# APS App - React + TypeScript + Vite + Electron

Agricultural Professional Services application built with React, TypeScript, Vite, and Electron.

## Setup Instructions

### 1. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit the `.env` file with your specific configuration:

- Set your API server URLs for development and production
- Configure the API secret key to match your backend
- Set the environment mode (`development` or `production`)
- For development: Configure quick login credentials (if needed)

**⚠️ Important:** Never commit the `.env` file to version control. It contains sensitive information.

### 2. Install Dependencies

```bash
npm install
```

### 3. Development

Start the development server:

```bash
npm run dev
```

### 4. Building

Build for production:

```bash
npm run build
```

Build without publishing:

```bash
npm run dist
```

## Authentication

The app uses JWT authentication with the following features:

- **Login Screen**: Email/password authentication
- **Remember Me**: Persistent login across app restarts
- **Session Management**: Automatic logout on token expiration
- **Quick Login** (Development only): Pre-configured test accounts

### Development Quick Login

When running in development mode, quick login buttons are available for testing. Configure these in your `.env` file:

```env
VITE_DEV_QUICK_LOGIN_PASSWORD=your-test-password
VITE_DEV_QUICK_LOGIN_USERS=user1@example.com,user2@example.com
VITE_DEV_QUICK_LOGIN_NAMES=User1,User2
```

## Security Notes

- Environment variables are properly configured in `.gitignore`
- Sensitive data is never hardcoded in source files
- JWT tokens are stored securely with proper expiration handling
- Quick login features are disabled in production builds

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

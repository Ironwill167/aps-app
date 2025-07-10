This file is for the Electron-vite app, APS-APP and uses React with TypeScript.
This file is used to provide instructions for the Copilot AI to generate code.
The backend app is a Node.js Express app that provides API for communication with the database and other services like emails.

## Developement Environment

- Developement is done in the workspace APS_Workspace located at C:\APS_Workspace
- This Electron-vite app is located in the folder C:\Users\USER-PC\Documents\APS App v0.4.2
- The backend's code can be referenced in this same workspace under the folder C:\APS-Backend-Clone it is only a clone and should not be edited directly.

## Project Structure

- Frontend: Electron app with React + TypeScript (Vite build tool)
- Backend: Node.js Express API server
- Database: PostgreSQL
- Main folders:
  - src/: Main React components and frontend logic
  - electron/: Electron main process files
  - public/: Static assets

## Technology Stack

- Frontend: React, TypeScript, Electron, Vite
- Backend: Node.js, Express
- UI Framework: [Specify if using Material-UI, Ant Design, etc.]
- State Management: Redux

## Code Style & Standards

- Use TypeScript strict mode
- Follow React functional components with hooks
- Use arrow functions for components
- File naming: PascalCase for components, camelCase for utilities
- Use proper TypeScript interfaces for props and data structures
- Follow ESLint/Prettier configurations

## Common Patterns

- API calls should use [your HTTP client - axios, fetch, etc.]
- Error handling pattern: There is a global toast notification system.

## Important Notes

- This is an Electron app, so consider both renderer and main process contexts
- API endpoints should reference the backend workspace (@space:APS_Backend)

## File Extensions & Conventions

- React components: .tsx
- Utility functions: .ts
- Styles: .scss
- Configuration files: .json, .js, .ts

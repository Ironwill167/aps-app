# APS App - AI Development Guide

## Architecture Overview

**APS App** is an insurance claims management Electron application using React + TypeScript + Vite. It follows a modular architecture with real-time updates and standardized modal patterns.

### Development Environment

- **Primary Workspace**: `C:\APS_Workspace`
- **Frontend Location**: `C:\Users\USER-PC\Documents\APS App v0.4.2\aps-app`
- **Backend Development**: `C:\APS_Workspace\APS-Backend-Clone\APS-Backend` (local testing environment with git push to main server)

### Core Stack & Project Structure

- **Frontend**: React 18 + TypeScript + Vite + Electron
- **Backend**: Node.js Express API + PostgreSQL database
- **State**: TanStack Query (data) + Redux Toolkit (app state) + Context (auth, socket)
- **Styling**: SCSS with organized modules (`src/components/componentStyling/`)

**Main Directories:**

- `src/`: Main React components and frontend logic
- `electron/`: Electron main process files
- `public/`: Static assets

## Key Architectural Patterns

### 1. Data Management Strategy

- **Primary**: TanStack Query for server state (`src/components/hooks/UseData.ts`)
- **Real-time**: Socket.IO context invalidates queries on data changes
- **Local State**: Redux for UI state, React Context for auth/socket
- **Pattern**: All CRUD operations use mutation hooks that auto-invalidate related queries

```typescript
// Standard data access pattern
const { files, updateFile, filesLoading } = useData();
```

### 2. Modal System Architecture

Highly standardized modal system with organized SCSS structure:

```
Modal_Styles/
├── _modalStyles.scss         # Master import file
├── _mainModalStyles.scss     # Shared base styles
├── _viewFileModal.scss       # File-specific overrides
├── _entityModal.scss         # Company/Contact modals
└── _responsiveModalStyles.scss # Responsive breakpoints
```

**Z-index hierarchy**: Background (1000) → Content (10) → Headers/Footers (15-25) → Dropdowns (99999)

### 3. File Status Workflow

Files are grouped by status into actionable categories:

```typescript
// Status progression workflow
'NEW' → 'SURVEY' → 'PRELIM' → 'DOC-RI'/'DOC-RR'/'DOC-RF' → 'RPT-S' → 'FEE-R' → 'FEE-P' → 'Closed'
```

Groups: `New Files`, `Doc Requests`, `Report Writing`, `Fees`, `OpenFiles`

### 4. React Select Pattern

For modal dropdowns, always include portal rendering to prevent z-index issues:

```typescript
<Select
  menuPortalTarget={document.body}
  styles={{ menuPortal: (base) => ({ ...base, zIndex: 99999 }) }}
  classNamePrefix="react-select"
/>
```

## Development Workflows

### Starting the Application

**Always use the complete file paths in a single command for proper execution:**

```powershell
# Backend (local development environment) - PowerShell
cd "C:\APS_Workspace\APS-Backend-Clone\APS-Backend"; npm start

# Frontend (development) - PowerShell
cd "C:\Users\USER-PC\Documents\APS_App_v0.4.2\aps-app"; npm run dev
```

```cmd
# Backend (local development environment) - Command Prompt
cd /d "C:\APS_Workspace\APS-Backend-Clone\APS-Backend" && npm start

# Frontend (development) - Command Prompt
cd /d "C:\Users\USER-PC\Documents\APS_App_v0.4.2\aps-app" && npm run dev
```

### Production Release Process

Production builds are automated through GitHub Actions. To create a new release:

```powershell
# Create a new version (patch, minor, or major) - PowerShell
cd "C:\Users\USER-PC\Documents\APS_App_v0.4.2\aps-app"; npm version patch; git push; git push --tags
```

```cmd
# Create a new version (patch, minor, or major) - Command Prompt
cd /d "C:\Users\USER-PC\Documents\APS_App_v0.4.2\aps-app" && npm version patch && git push && git push --tags
```

This will:

1. Increment the version number in `package.json`
2. Create a git tag
3. Push changes and tags to GitHub
4. Trigger GitHub Actions to automatically build and release the application

**⚠️ Important**: Use the single-command format above to ensure the terminal navigates to the correct directory before executing npm commands.

### Backend Development Workflow

The backend is set up for local testing and development:

- Make changes in `C:\APS_Workspace\APS-Backend-Clone\APS-Backend`
- Test locally with the frontend
- Use git to push changes to the main production server
- Backend supports automatic deployment from the `main` branch

### Code Style & Standards

- **TypeScript**: Use strict mode with proper interfaces for props and data structures
- **Components**: React functional components with hooks, arrow functions preferred
- **File Naming**: PascalCase for components, camelCase for utilities
- **API Integration**: Use global toast notification system for error handling
- **Electron Context**: Consider both renderer and main process contexts
- **Backend Development**: Backend can be modified in the clone folder for testing before pushing to production

### Environment Configuration

Configuration is managed through `src/components/config.ts` with auto-detection:

- Development: `http://localhost:3000` (auto-detected via port 5173)
- Production: Environment variable based
- Override: `localStorage.setItem('aps-app-environment-override', 'development')`

### Adding New Modals

1. Create component in `src/components/Modals/`
2. Add SCSS file in `componentStyling/Modal_Styles/_newModal.scss`
3. Import in `_modalStyles.scss`
4. Use standard structure: `.modal > .modal-content.your-modal-content`

## Component Communication Patterns

### 1. File Operations

```typescript
// Standard file update pattern
const updateFileMutation = useUpdateFile();
await updateFileMutation.mutateAsync({ id, updatedFile });
onFileUpdated(); // Callback to parent
```

### 2. Toast Notifications

Global toast system for user feedback:

```typescript
import { showSuccessToast, showErrorToast } from '../utils/toast';
showSuccessToast('Operation completed!');
```

### 3. Additional Parties Pattern

Dynamic sub-entities attached to files with inline editing:

```typescript
// Access through useData hook
const { additionalParties, updateAdditionalParty } = useData();
// Filter by file_id for current file
const relevantParties = additionalParties.filter((ap) => ap.file_id === file.id);
```

## Critical Integration Points

### 1. Electron IPC Communication

Main process integration defined in `electron/preload.ts`:

```typescript
// Invoice generation workflow
window.electronAPI.generateInvoicePdf(invoiceData);
window.electronAPI.onInvoiceData((data) => setInvoiceData(data));
```

### 2. Real-time Updates via Socket.IO

Socket context (`src/components/utils/SocketContext.tsx`) invalidates queries:

```typescript
socket.on('dataChanged', (data) => {
  queryClient.invalidateQueries({ queryKey: [data.type] });
});
```

### 3. PDF Invoice Route

Separate route `/invoice` for PDF generation with isolated styling:

- Uses `InvoicePage.tsx` component
- Adds `pdf-rendering` class to disable responsive styles
- Renders in separate window for PDF generation

## File Naming & Organization

- **Components**: `PascalCase.tsx` in feature folders
- **Hooks**: `Use*.ts` in `hooks/` directory
- **Styles**: `_componentName.scss` with SCSS modules
- **Types**: Centralized in `src/components/types.ts`
- **Utils**: `camelCase.ts` in `utils/` directory

## Styling Conventions

### SCSS Module System

```scss
@use 'variables' as *;
@use 'mixins' as *;

.component-name {
  @include display-flex($direction: row, $align: center);
  // Component-specific styles
}
```

### Responsive Design

Desktop-first with viewport units and clamp():

```scss
font-size: clamp(13px, 1.1vw, 15px);
padding: clamp(6px, 0.8vw, 12px);
```

## Common Gotchas

1. **Modal Z-index**: Always use `menuPortalTarget={document.body}` for react-select
2. **Socket Dependencies**: Don't add `outstandingDocuments` to useEffect deps (causes loops)
3. **File Status Logic**: Status determines which group files appear in
4. **Environment Detection**: Uses multiple fallbacks for dev/prod detection
5. **PDF Rendering**: Uses separate route with isolated CSS classes

## API Integration

Standard pattern using TanStack Query:

```typescript
// Queries auto-refresh every 30 seconds
const { data, isLoading, error } = useQuery({
  queryKey: ['resourceName'],
  queryFn: async () => (await apiFunction()).data,
  refetchInterval: 30000,
});
```

Backend endpoints follow REST conventions: `/api/resource` with standard CRUD operations.

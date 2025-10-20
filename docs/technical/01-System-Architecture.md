# VALORANT-HUB Desktop App - System Architecture

## Overview
The VALORANT-HUB Desktop App is built using Electron.js with a modern tech stack focused on performance, security, and scalability. The architecture follows a multi-layered approach with clear separation of concerns.

## Technology Stack

### Frontend
- **Framework**: Electron.js (cross-platform desktop app)
- **UI Library**: React 18+ with TypeScript
- **Styling**: Material-UI + Custom Valorant-themed components
- **State Management**: Redux Toolkit with RTK Query
- **HTTP Client**: Axios with interceptors
- **Internationalization**: react-i18next

### Backend/Local Services
- **Runtime**: Node.js (embedded in Electron)
- **Database**: SQLite with better-sqlite3
- **Encryption**: SQLCipher for database encryption
- **Authentication**: electron-oauth2 for Riot OAuth 2.0
- **Secure Storage**: keytar for token storage
- **Updates**: electron-updater with auto-update

### External Integrations
- **Riot Games API**: OAuth 2.0 + REST API
- **OpenAI API**: GPT-4 for AI assistant
- **Stripe API**: Payment processing
- **VLR.gg API**: Esports data
- **Google AdMob**: Advertisement integration

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Electron Main Process                     │
├─────────────────────────────────────────────────────────────┤
│  • Window Management    • Auto-updater    • Security        │
│  • File System Access  • Notifications   • Deep Links      │
│  • Native OS APIs      • Menu/Tray       • IPC Handler     │
└─────────────────┬───────────────────────────┬───────────────┘
                  │                           │
                  │ IPC Communication         │
                  │                           │
┌─────────────────▼───────────────────────────▼───────────────┐
│                Electron Renderer Process                     │
├─────────────────────────────────────────────────────────────┤
│                      React App                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Layout    │ │ Components  │ │   Routing   │           │
│  │ Management  │ │   Library   │ │  (Router)   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Redux     │ │  API Layer  │ │ Local DB    │           │
│  │   Store     │ │  (RTK Query)│ │  Manager    │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────┬───────────────────────────┬───────────────┘
                  │                           │
                  │                           │
┌─────────────────▼───────────────┐ ┌─────────▼───────────────┐
│        Local SQLite DB          │ │    External APIs        │
├─────────────────────────────────┤ ├─────────────────────────┤
│  • User Settings               │ │  • Riot Games API       │
│  • Cached Content             │ │  • OpenAI API           │
│  • AI Query History           │ │  • Backend API          │
│  • Favorites                  │ │  • Stripe API           │
│  • User Statistics            │ │  • VLR.gg API           │
└─────────────────────────────────┘ └─────────────────────────┘
```

## Core Components

### 1. Main Process (Electron)
**File**: `src/main/main.ts`

Responsibilities:
- Application lifecycle management
- Window creation and management
- Security policies and CSP
- Auto-updater integration
- Native OS integration (notifications, file system)
- IPC communication handler

### 2. Renderer Process (React App)
**File**: `src/renderer/App.tsx`

Responsibilities:
- User interface rendering
- State management
- API communication
- Local data management
- User interaction handling

### 3. Database Layer
**Files**: `src/database/`

Components:
- `DatabaseManager.ts` - Main database interface
- `migrations/` - Database schema migrations
- `models/` - TypeScript interfaces for data models
- `repositories/` - Data access layer

### 4. API Layer
**Files**: `src/api/`

Components:
- `RiotAPI.ts` - Riot Games API integration
- `OpenAI.ts` - AI assistant integration
- `BackendAPI.ts` - Main backend communication
- `StripeAPI.ts` - Payment processing

### 5. Authentication System
**Files**: `src/auth/`

Components:
- `AuthManager.ts` - OAuth 2.0 flow management
- `TokenManager.ts` - Secure token storage and refresh
- `PermissionManager.ts` - User permission handling

## Data Flow

### Authentication Flow
1. User clicks "Login with Riot"
2. Electron opens OAuth window
3. User authenticates with Riot
4. App receives authorization code
5. Exchange code for access/refresh tokens
6. Store tokens securely using keytar
7. Fetch user profile and game data
8. Update Redux store with user state

### Content Loading Flow
1. App startup triggers content sync
2. Check local cache validity
3. Fetch new content from backend API
4. Update local SQLite database
5. Notify UI components of new data
6. Render updated content to user

### AI Assistant Flow
1. User submits query in chat interface
2. Check daily limit (free tier: 5 queries)
3. Prepare context from user data and knowledge base
4. Send request to OpenAI API
5. Process and format response
6. Store query/response in local history
7. Display formatted response to user

## Performance Considerations

### Startup Optimization
- Lazy load non-critical components
- Use React.lazy() and Suspense
- Minimize main process startup code
- Cache frequently accessed data
- Optimize bundle size with tree shaking

### Memory Management
- Implement proper component cleanup
- Use React.memo for expensive components
- Debounce API calls and user inputs
- Implement virtual scrolling for large lists
- Monitor memory usage with electron-log

### Database Performance
- Use database indexing for frequent queries
- Implement connection pooling
- Use prepared statements
- Regular database optimization
- Implement data archiving for old records

## Security Architecture

### Data Protection
- All sensitive data encrypted at rest
- API tokens stored in OS keychain
- Database encryption with SQLCipher
- Input validation and sanitization
- HTTPS for all external communications

### Authentication Security
- OAuth 2.0 with PKCE flow
- Token rotation and refresh
- Secure token storage
- Session timeout handling
- Permission-based access control

### Application Security
- Content Security Policy (CSP)
- Disable Node.js integration in renderer
- Context isolation enabled
- Validate all IPC messages
- Regular security audits

## Scalability Considerations

### Modular Architecture
- Feature-based folder structure
- Pluggable component system
- Configurable feature flags
- Environment-specific configurations
- Microservice-ready API design

### Platform Expansion
- Abstract platform-specific code
- Use cross-platform libraries
- Implement platform detection
- Separate UI and business logic
- Prepare for mobile companion app

### Internationalization
- Externalized string resources
- RTL language support preparation
- Cultural adaptation considerations
- Dynamic language switching
- Locale-specific formatting

## Monitoring and Observability

### Logging Strategy
- Structured logging with winston
- Log levels: ERROR, WARN, INFO, DEBUG
- Separate logs for different components
- Log rotation and cleanup
- Performance metrics logging

### Error Tracking
- Integration with Sentry
- Custom error boundaries
- Crash reporting
- User feedback collection
- Performance monitoring

### Analytics
- User behavior tracking
- Feature usage statistics
- Performance metrics
- Conversion funnel analysis
- A/B testing framework

## Development Environment

### Build System
- Webpack for bundling
- TypeScript compilation
- Hot reloading in development
- Source maps for debugging
- Environment variable management

### Testing Strategy
- Unit tests with Jest
- Integration tests with Playwright
- Component tests with React Testing Library
- E2E tests for critical flows
- Performance testing with Lighthouse

### Code Quality
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks
- TypeScript strict mode
- Code coverage reporting

# VALORANT-HUB Desktop App - Complete Codebase Structure

## Project Structure
```
valorant-hub/
├── package.json
├── package-lock.json
├── tsconfig.json
├── webpack.config.js
├── electron-builder.config.js
├── .env.example
├── .gitignore
├── README.md
├── docs/
│   ├── 01-System-Architecture.md
│   ├── 02-Installation-and-Updates.md
│   ├── 03-Riot-Games-Integration.md
│   ├── 04-Database-Schema.md
│   ├── 05-Features-Implementation.md
│   └── 06-Codebase-Structure.md
├── assets/
│   ├── icons/
│   │   ├── icon.ico
│   │   ├── icon.png
│   │   └── tray-icon.png
│   ├── images/
│   └── sounds/
├── src/
│   ├── main/
│   │   ├── main.ts
│   │   ├── preload.ts
│   │   ├── ipc/
│   │   │   ├── handlers/
│   │   │   └── types.ts
│   │   ├── updater/
│   │   │   └── UpdateManager.ts
│   │   ├── security/
│   │   │   └── SecurityManager.ts
│   │   └── utils/
│   │       ├── logger.ts
│   │       └── helpers.ts
│   ├── renderer/
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   ├── index.html
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── content/
│   │   │   ├── forum/
│   │   │   ├── ai/
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   └── subscription/
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── ContentPage.tsx
│   │   │   ├── ForumPage.tsx
│   │   │   ├── AIAssistantPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── SubscriptionPage.tsx
│   │   ├── hooks/
│   │   ├── store/
│   │   │   ├── index.ts
│   │   │   ├── slices/
│   │   │   └── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── styles/
│   │   │   ├── theme.ts
│   │   │   ├── global.css
│   │   │   └── components/
│   │   └── locales/
│   │       ├── en.json
│   │       └── uk.json
│   ├── shared/
│   │   ├── types/
│   │   ├── constants/
│   │   └── utils/
│   ├── api/
│   │   ├── RiotAPIClient.ts
│   │   ├── BackendAPIClient.ts
│   │   └── OpenAIClient.ts
│   ├── auth/
│   │   ├── RiotAuthManager.ts
│   │   ├── TokenManager.ts
│   │   └── PermissionManager.ts
│   ├── database/
│   │   ├── DatabaseManager.ts
│   │   ├── MaintenanceManager.ts
│   │   ├── migrations/
│   │   └── repositories/
│   ├── services/
│   │   ├── ContentService.ts
│   │   ├── ForumService.ts
│   │   ├── AIAssistantService.ts
│   │   ├── SubscriptionService.ts
│   │   ├── NotificationService.ts
│   │   └── AnalyticsService.ts
│   └── privacy/
│       └── PrivacyManager.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
├── scripts/
│   ├── build.js
│   ├── dev.js
│   └── test.js
└── dist/
    ├── main/
    └── renderer/
```

## Core Configuration Files

### package.json
```json
{
  "name": "valorant-hub",
  "version": "1.0.0",
  "description": "VALORANT-HUB Desktop App - Your ultimate VALORANT companion",
  "main": "dist/main/main.js",
  "homepage": "./",
  "scripts": {
    "dev": "concurrently \"npm run dev:main\" \"npm run dev:renderer\"",
    "dev:main": "webpack --config webpack.main.config.js --mode development --watch",
    "dev:renderer": "webpack serve --config webpack.renderer.config.js --mode development",
    "build": "npm run build:main && npm run build:renderer",
    "build:main": "webpack --config webpack.main.config.js --mode production",
    "build:renderer": "webpack --config webpack.renderer.config.js --mode production",
    "start": "electron dist/main/main.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "dist": "npm run build && electron-builder",
    "dist:win": "npm run build && electron-builder --win",
    "dist:mac": "npm run build && electron-builder --mac",
    "dist:linux": "npm run build && electron-builder --linux"
  },
  "keywords": ["valorant", "gaming", "esports", "desktop-app", "electron"],
  "author": "VALORANT-HUB Team",
  "license": "MIT",
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.8",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@typescript-eslint/eslint-plugin": "^6.13.2",
    "@typescript-eslint/parser": "^6.13.2",
    "concurrently": "^8.2.2",
    "css-loader": "^6.8.1",
    "electron": "^28.0.0",
    "electron-builder": "^24.8.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "html-webpack-plugin": "^5.6.0",
    "jest": "^29.7.0",
    "playwright": "^1.40.1",
    "style-loader": "^3.3.3",
    "ts-loader": "^9.5.1",
    "typescript": "^5.3.3",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^4.15.1"
  },
  "dependencies": {
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.15.1",
    "@mui/material": "^5.15.1",
    "@reduxjs/toolkit": "^2.0.1",
    "axios": "^1.6.2",
    "better-sqlite3": "^9.2.2",
    "electron-log": "^5.0.1",
    "electron-oauth2": "^3.0.0",
    "electron-store": "^8.1.0",
    "electron-updater": "^6.1.7",
    "keytar": "^7.9.0",
    "node-machine-id": "^1.1.12",
    "openai": "^4.20.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-i18next": "^13.5.0",
    "react-redux": "^9.0.4",
    "react-router-dom": "^6.20.1",
    "socket.io-client": "^4.7.4",
    "stripe": "^14.9.0",
    "winston": "^3.11.0"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@main/*": ["src/main/*"],
      "@renderer/*": ["src/renderer/*"],
      "@shared/*": ["src/shared/*"]
    }
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "tests"
  ]
}
```

## Main Process Files

### src/main/main.ts
```typescript
import { app, BrowserWindow, ipcMain, Menu, shell, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import isDev from 'electron-is-dev';
import { DatabaseManager } from '../database/DatabaseManager';
import { UpdateManager } from './updater/UpdateManager';
import { SecurityManager } from './security/SecurityManager';
import { logger } from './utils/logger';
import { setupIPC } from './ipc/handlers';

class ValorantHubApp {
  private mainWindow: BrowserWindow | null = null;
  private databaseManager: DatabaseManager | null = null;
  private updateManager: UpdateManager | null = null;
  private securityManager: SecurityManager | null = null;

  constructor() {
    this.setupApp();
  }

  private setupApp(): void {
    // Handle app ready
    app.whenReady().then(() => {
      this.createMainWindow();
      this.setupServices();
      this.setupMenu();
      this.setupProtocols();
    });

    // Handle window closed
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        this.cleanup();
        app.quit();
      }
    });

    // Handle app activate (macOS)
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow();
      }
    });

    // Handle before quit
    app.on('before-quit', () => {
      this.cleanup();
    });

    // Handle certificate errors
    app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
      if (isDev) {
        // In development, ignore certificate errors
        event.preventDefault();
        callback(true);
      } else {
        // In production, use default behavior
        callback(false);
      }
    });
  }

  private createMainWindow(): void {
    // Create the browser window
    this.mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 1200,
      minHeight: 800,
      show: false,
      icon: path.join(__dirname, '../../assets/icons/icon.png'),
      titleBarStyle: 'default',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, 'preload.js'),
        webSecurity: !isDev
      }
    });

    // Load the app
    const indexPath = isDev 
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../renderer/index.html')}`;
    
    this.mainWindow.loadURL(indexPath);

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
      
      if (isDev) {
        this.mainWindow?.webContents.openDevTools();
      }
    });

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    // Handle external links
    this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: 'deny' };
    });
  }

  private setupServices(): void {
    if (!this.mainWindow) return;

    try {
      // Initialize database
      this.databaseManager = new DatabaseManager();
      
      // Initialize security manager
      this.securityManager = new SecurityManager();
      
      // Initialize update manager
      this.updateManager = new UpdateManager(this.mainWindow);
      
      // Setup IPC handlers
      setupIPC(this.mainWindow, this.databaseManager);
      
      logger.info('All services initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize services:', error);
      
      dialog.showErrorBox(
        'Initialization Error',
        'Failed to initialize application services. Please restart the application.'
      );
    }
  }

  private setupMenu(): void {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'File',
        submenu: [
          {
            label: 'Settings',
            accelerator: 'CmdOrCtrl+,',
            click: () => {
              this.mainWindow?.webContents.send('navigate-to', '/settings');
            }
          },
          { type: 'separator' },
          {
            label: 'Exit',
            accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
            click: () => {
              app.quit();
            }
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' }
        ]
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' }
        ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'About',
            click: () => {
              dialog.showMessageBox(this.mainWindow!, {
                type: 'info',
                title: 'About VALORANT-HUB',
                message: 'VALORANT-HUB Desktop App',
                detail: `Version: ${app.getVersion()}\nElectron: ${process.versions.electron}\nNode: ${process.versions.node}`
              });
            }
          },
          {
            label: 'Check for Updates',
            click: () => {
              this.updateManager?.checkForUpdates();
            }
          }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  private setupProtocols(): void {
    // Register custom protocol for OAuth callbacks
    app.setAsDefaultProtocolClient('valoranthub');
    
    // Handle protocol URLs (for OAuth)
    app.on('open-url', (event, url) => {
      event.preventDefault();
      this.handleProtocolUrl(url);
    });

    // Handle protocol URLs on Windows
    if (process.platform === 'win32') {
      const args = process.argv.slice(1);
      if (args.length > 0 && args[0].startsWith('valoranthub://')) {
        this.handleProtocolUrl(args[0]);
      }
    }
  }

  private handleProtocolUrl(url: string): void {
    logger.info('Protocol URL received:', url);
    
    if (url.startsWith('valoranthub://auth/callback')) {
      // Handle OAuth callback
      this.mainWindow?.webContents.send('oauth-callback', url);
    }
  }

  private cleanup(): void {
    try {
      this.updateManager?.destroy();
      this.databaseManager?.close();
      logger.info('Application cleanup completed');
    } catch (error) {
      logger.error('Error during cleanup:', error);
    }
  }
}

// Create app instance
new ValorantHubApp();
```

### src/main/preload.ts
```typescript
import { contextBridge, ipcRenderer } from 'electron';

// Define the API interface
interface ElectronAPI {
  // Window controls
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  
  // Database operations
  query: (sql: string, params?: any[]) => Promise<any[]>;
  execute: (sql: string, params?: any[]) => Promise<any>;
  
  // Authentication
  authenticateWithRiot: () => Promise<any>;
  logout: () => Promise<void>;
  getAuthStatus: () => Promise<boolean>;
  
  // Content operations
  getContent: (filters?: any) => Promise<any[]>;
  getContentById: (id: string) => Promise<any>;
  addToFavorites: (contentId: string, contentType: string) => Promise<void>;
  removeFromFavorites: (contentId: string) => Promise<void>;
  
  // AI operations
  sendAIQuery: (query: string, type: string) => Promise<any>;
  getAIHistory: () => Promise<any[]>;
  
  // Forum operations
  getForumPosts: (filters?: any) => Promise<any[]>;
  createForumPost: (post: any) => Promise<any>;
  createForumReply: (reply: any) => Promise<any>;
  
  // Subscription operations
  createCheckoutSession: (planId: string) => Promise<string>;
  getSubscriptionStatus: () => Promise<any>;
  cancelSubscription: () => Promise<void>;
  
  // Settings
  getSetting: (key: string) => Promise<any>;
  setSetting: (key: string, value: any) => Promise<void>;
  
  // Notifications
  showNotification: (title: string, body: string) => void;
  
  // Updates
  checkForUpdates: () => void;
  downloadUpdate: () => void;
  installUpdate: () => void;
  
  // Event listeners
  on: (channel: string, callback: (...args: any[]) => void) => void;
  removeListener: (channel: string, callback: (...args: any[]) => void) => void;
  removeAllListeners: (channel: string) => void;
  
  // Update events
  onUpdateAvailable: (callback: (info: any) => void) => void;
  onUpdateProgress: (callback: (progress: any) => void) => void;
  onUpdateError: (callback: (error: any) => void) => void;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronAPI: ElectronAPI = {
  // Window controls
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  
  // Database operations
  query: (sql: string, params?: any[]) => ipcRenderer.invoke('db-query', sql, params),
  execute: (sql: string, params?: any[]) => ipcRenderer.invoke('db-execute', sql, params),
  
  // Authentication
  authenticateWithRiot: () => ipcRenderer.invoke('auth-riot'),
  logout: () => ipcRenderer.invoke('auth-logout'),
  getAuthStatus: () => ipcRenderer.invoke('auth-status'),
  
  // Content operations
  getContent: (filters?: any) => ipcRenderer.invoke('content-get', filters),
  getContentById: (id: string) => ipcRenderer.invoke('content-get-by-id', id),
  addToFavorites: (contentId: string, contentType: string) => 
    ipcRenderer.invoke('favorites-add', contentId, contentType),
  removeFromFavorites: (contentId: string) => 
    ipcRenderer.invoke('favorites-remove', contentId),
  
  // AI operations
  sendAIQuery: (query: string, type: string) => 
    ipcRenderer.invoke('ai-query', query, type),
  getAIHistory: () => ipcRenderer.invoke('ai-history'),
  
  // Forum operations
  getForumPosts: (filters?: any) => ipcRenderer.invoke('forum-get-posts', filters),
  createForumPost: (post: any) => ipcRenderer.invoke('forum-create-post', post),
  createForumReply: (reply: any) => ipcRenderer.invoke('forum-create-reply', reply),
  
  // Subscription operations
  createCheckoutSession: (planId: string) => 
    ipcRenderer.invoke('subscription-checkout', planId),
  getSubscriptionStatus: () => ipcRenderer.invoke('subscription-status'),
  cancelSubscription: () => ipcRenderer.invoke('subscription-cancel'),
  
  // Settings
  getSetting: (key: string) => ipcRenderer.invoke('settings-get', key),
  setSetting: (key: string, value: any) => ipcRenderer.invoke('settings-set', key, value),
  
  // Notifications
  showNotification: (title: string, body: string) => 
    ipcRenderer.send('notification-show', title, body),
  
  // Updates
  checkForUpdates: () => ipcRenderer.send('update-check'),
  downloadUpdate: () => ipcRenderer.send('update-download'),
  installUpdate: () => ipcRenderer.send('update-install'),
  
  // Event listeners
  on: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (_, ...args) => callback(...args));
  },
  removeListener: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, callback);
  },
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
  
  // Update events
  onUpdateAvailable: (callback: (info: any) => void) => {
    ipcRenderer.on('update-available', (_, info) => callback(info));
  },
  onUpdateProgress: (callback: (progress: any) => void) => {
    ipcRenderer.on('update-progress', (_, progress) => callback(progress));
  },
  onUpdateError: (callback: (error: any) => void) => {
    ipcRenderer.on('update-error', (_, error) => callback(error));
  }
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Also expose some Node.js globals that might be useful
contextBridge.exposeInMainWorld('versions', {
  node: process.versions.node,
  chrome: process.versions.chrome,
  electron: process.versions.electron
});
```

## Renderer Process Files

### src/renderer/App.tsx
```typescript
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import { store } from './store';
import { theme } from './styles/theme';
import i18n from './utils/i18n';

// Layout Components
import { MainLayout } from './components/layout/MainLayout';
import { LoadingScreen } from './components/common/LoadingScreen';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { UpdateNotification } from './components/common/UpdateNotification';

// Pages
import { HomePage } from './pages/HomePage';
import { ContentPage } from './pages/ContentPage';
import { ForumPage } from './pages/ForumPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { LoginPage } from './pages/LoginPage';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useAppInitialization } from './hooks/useAppInitialization';

const App: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isInitialized, error: initError } = useAppInitialization();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // App is ready when both auth and initialization are complete
    if (!authLoading && isInitialized) {
      setIsAppReady(true);
    }
  }, [authLoading, isInitialized]);

  // Show loading screen while app initializes
  if (!isAppReady) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingScreen message="Initializing VALORANT-HUB..." />
      </ThemeProvider>
    );
  }

  // Show error if initialization failed
  if (initError) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          flexDirection="column"
          gap={2}
        >
          <h1>Initialization Error</h1>
          <p>{initError}</p>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <UpdateNotification />
              
              {!isAuthenticated ? (
                <LoginPage />
              ) : (
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/content" element={<ContentPage />} />
                    <Route path="/content/:id" element={<ContentPage />} />
                    <Route path="/forum" element={<ForumPage />} />
                    <Route path="/forum/:postId" element={<ForumPage />} />
                    <Route path="/ai-assistant" element={<AIAssistantPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/subscription" element={<SubscriptionPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </MainLayout>
              )}
            </Router>
          </ThemeProvider>
        </I18nextProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
```

### src/renderer/index.tsx
```typescript
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Import global styles
import './styles/global.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(<App />);
```

### src/renderer/index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self' https://api.riotgames.com https://api.openai.com https://api.stripe.com;
  ">
  <title>VALORANT-HUB</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

## Component Examples

### src/renderer/components/layout/MainLayout.tsx
```typescript
import React, { ReactNode } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  useTheme
} from '@mui/material';
import {
  Home,
  Article,
  Forum,
  SmartToy,
  Person,
  Settings,
  Premium
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface MainLayoutProps {
  children: ReactNode;
}

const drawerWidth = 280;

const navigationItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/content', label: 'Content', icon: Article },
  { path: '/forum', label: 'Forum', icon: Forum },
  { path: '/ai-assistant', label: 'AI Assistant', icon: SmartToy },
  { path: '/profile', label: 'Profile', icon: Person },
  { path: '/subscription', label: 'Premium', icon: Premium },
  { path: '/settings', label: 'Settings', icon: Settings }
];

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const isPremium = useSelector((state: RootState) => state.subscription.isPremium);

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            VALORANT-HUB
          </Typography>
          
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isPremium && (
                <Typography
                  variant="caption"
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontWeight: 'bold'
                  }}
                >
                  PREMIUM
                </Typography>
              )}
              <Typography variant="body2">
                {user.gameName}#{user.tagLine}
              </Typography>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: theme.palette.primary.main
                }}
              >
                {user.gameName.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.default,
            borderRight: `1px solid ${theme.palette.divider}`
          }
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img
              src="/assets/icons/icon.png"
              alt="VALORANT-HUB"
              style={{ width: 32, height: 32 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              VALORANT-HUB
            </Typography>
          </Box>
        </Toolbar>
        
        <Divider />
        
        <List sx={{ pt: 2 }}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <ListItem key={item.path} disablePadding sx={{ px: 2, mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: isActive ? theme.palette.primary.main + '20' : 'transparent',
                    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main + '10'
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? theme.palette.primary.main : theme.palette.text.secondary
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontWeight: isActive ? 600 : 400
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: theme.palette.background.default,
          p: 3,
          mt: 8 // Account for AppBar height
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
```

### src/renderer/pages/HomePage.tsx
```typescript
import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress
} from '@mui/material';
import { TrendingUp, Article, Forum, SmartToy } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState, AppDispatch } from '../store';
import { fetchUserStats, fetchRecentMatches } from '../store/slices/profileSlice';
import { fetchFeaturedContent } from '../store/slices/contentSlice';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  
  const user = useSelector((state: RootState) => state.auth.user);
  const userStats = useSelector((state: RootState) => state.profile.stats);
  const recentMatches = useSelector((state: RootState) => state.profile.recentMatches);
  const featuredContent = useSelector((state: RootState) => state.content.featured);
  const isPremium = useSelector((state: RootState) => state.subscription.isPremium);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserStats(user.puuid));
      dispatch(fetchRecentMatches(user.puuid));
      dispatch(fetchFeaturedContent());
    }
  }, [dispatch, user]);

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('home.welcome')}, {user?.gameName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('home.subtitle')}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* User Stats Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {t('home.stats.title')}
                </Typography>
              </Box>
              
              {userStats ? (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="primary">
                      {userStats.winRate.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('home.stats.winRate')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="primary">
                      {userStats.averageKDA.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('home.stats.kda')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="primary">
                      {userStats.averageACS.toFixed(0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('home.stats.acs')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="primary">
                      {userStats.headshotPercentage.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('home.stats.headshots')}
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <LinearProgress />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('home.quickActions.title')}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Article />}
                  fullWidth
                  onClick={() => window.location.hash = '/content'}
                >
                  {t('home.quickActions.browseContent')}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<SmartToy />}
                  fullWidth
                  onClick={() => window.location.hash = '/ai-assistant'}
                >
                  {t('home.quickActions.askAI')}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Forum />}
                  fullWidth
                  onClick={() => window.location.hash = '/forum'}
                >
                  {t('home.quickActions.visitForum')}
                </Button>
                
                {!isPremium && (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => window.location.hash = '/subscription'}
                  >
                    {t('home.quickActions.upgradePremium')}
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Featured Content */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            {t('home.featuredContent.title')}
          </Typography>
          
          <Grid container spacing={2}>
            {featuredContent.map((content) => (
              <Grid item xs={12} sm={6} md={4} key={content.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" noWrap gutterBottom>
                      {content.title}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {content.summary}
                    </Typography>
                    
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={content.category}
                        size="small"
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {content.estimatedReadTime} min read
                      </Typography>
                    </Box>
                    
                    <Button
                      variant="text"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() => window.location.hash = `/content/${content.id}`}
                    >
                      {t('common.readMore')}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
```

## Build Configuration

### webpack.main.config.js
```javascript
const path = require('path');

module.exports = {
  target: 'electron-main',
  entry: './src/main/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist/main'),
    filename: 'main.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@main': path.resolve(__dirname, 'src/main'),
      '@shared': path.resolve(__dirname, 'src/shared')
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    'better-sqlite3': 'commonjs better-sqlite3',
    'keytar': 'commonjs keytar',
    'node-machine-id': 'commonjs node-machine-id'
  },
  node: {
    __dirname: false,
    __filename: false
  }
};
```

### webpack.renderer.config.js
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  target: 'electron-renderer',
  entry: './src/renderer/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist/renderer'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@renderer': path.resolve(__dirname, 'src/renderer'),
      '@shared': path.resolve(__dirname, 'src/shared')
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html'
    })
  ],
  devServer: {
    port: 3000,
    hot: true
  }
};
```

This comprehensive codebase structure provides a solid foundation for the VALORANT-HUB Desktop App with proper separation of concerns, type safety, and modern development practices.

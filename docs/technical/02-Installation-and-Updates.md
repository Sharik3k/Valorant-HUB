В# VALORANT-HUB Desktop App - Installation and Updates System

## Overview
The installation and updates system ensures seamless deployment and maintenance of the VALORANT-HUB Desktop App across Windows platforms. It uses MSI installers for initial installation and electron-updater for automatic updates.

## Installation System

### MSI Installer Configuration
**Tool**: electron-builder with MSI target

**Configuration File**: `electron-builder.config.js`
```javascript
module.exports = {
  appId: "com.valoranthub.desktop",
  productName: "VALORANT-HUB",
  directories: {
    output: "dist"
  },
  files: [
    "dist/main/**/*",
    "dist/renderer/**/*",
    "node_modules/**/*",
    "package.json"
  ],
  win: {
    target: [
      {
        target: "msi",
        arch: ["x64", "ia32"]
      },
      {
        target: "nsis",
        arch: ["x64", "ia32"]
      }
    ],
    icon: "assets/icon.ico",
    requestedExecutionLevel: "asInvoker",
    publisherName: "VALORANT-HUB Team",
    verifyUpdateCodeSignature: false
  },
  msi: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: "VALORANT-HUB",
    runAfterFinish: true
  },
  publish: {
    provider: "github",
    owner: "valoranthub-team",
    repo: "valorant-hub-releases"
  }
};
```

### Installation Requirements
- **OS**: Windows 10 (version 1903+) or Windows 11
- **Architecture**: x64 or x86
- **Disk Space**: 150 MB minimum
- **RAM**: 4 GB minimum
- **Internet**: Required for initial setup and updates

### Installation Flow
1. **Download**: User downloads MSI from official website
2. **Security Check**: Windows SmartScreen verification
3. **Welcome Screen**: Installation wizard introduction
4. **License Agreement**: Terms of service acceptance
5. **Installation Path**: Default or custom directory selection
6. **Shortcuts**: Desktop and Start Menu shortcut options
7. **Installation**: File extraction and registry entries
8. **Completion**: Launch option and finish confirmation

### Registry Entries
```registry
[HKEY_LOCAL_MACHINE\SOFTWARE\VALORANT-HUB]
"InstallPath"="C:\Program Files\VALORANT-HUB"
"Version"="1.0.0"
"UninstallString"="C:\Program Files\VALORANT-HUB\Uninstall.exe"

[HKEY_CURRENT_USER\SOFTWARE\VALORANT-HUB]
"AutoStart"=dword:00000001
"CheckForUpdates"=dword:00000001
"InstallDate"="2025-10-02"
```

## Auto-Update System

### Update Architecture
**Library**: electron-updater
**Update Server**: GitHub Releases or custom server
**Update Channel**: stable, beta, alpha

### Update Configuration
**File**: `src/main/updater/UpdateManager.ts`
```typescript
import { autoUpdater } from 'electron-updater';
import { app, BrowserWindow, dialog } from 'electron';
import { logger } from '../utils/logger';

export class UpdateManager {
  private mainWindow: BrowserWindow;
  private updateCheckInterval: NodeJS.Timeout | null = null;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.setupAutoUpdater();
  }

  private setupAutoUpdater(): void {
    // Configure update server
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'valoranthub-team',
      repo: 'valorant-hub-releases',
      private: false
    });

    // Update check interval (every 6 hours)
    autoUpdater.checkForUpdatesAndNotify();
    this.updateCheckInterval = setInterval(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 6 * 60 * 60 * 1000);

    // Event handlers
    autoUpdater.on('checking-for-update', () => {
      logger.info('Checking for updates...');
    });

    autoUpdater.on('update-available', (info) => {
      logger.info('Update available:', info.version);
      this.notifyUpdateAvailable(info);
    });

    autoUpdater.on('update-not-available', () => {
      logger.info('No updates available');
    });

    autoUpdater.on('error', (error) => {
      logger.error('Update error:', error);
      this.handleUpdateError(error);
    });

    autoUpdater.on('download-progress', (progress) => {
      this.updateDownloadProgress(progress);
    });

    autoUpdater.on('update-downloaded', (info) => {
      logger.info('Update downloaded:', info.version);
      this.notifyUpdateReady(info);
    });
  }

  public async checkForUpdates(): Promise<void> {
    try {
      await autoUpdater.checkForUpdatesAndNotify();
    } catch (error) {
      logger.error('Manual update check failed:', error);
    }
  }

  private notifyUpdateAvailable(info: any): void {
    // Send to renderer process
    this.mainWindow.webContents.send('update-available', {
      version: info.version,
      releaseNotes: info.releaseNotes,
      size: info.files[0]?.size || 0
    });

    // Show Windows notification
    new Notification({
      title: 'VALORANT-HUB Update Available',
      body: `Version ${info.version} is available for download.`,
      icon: path.join(__dirname, '../assets/icon.png')
    }).show();
  }

  private updateDownloadProgress(progress: any): void {
    this.mainWindow.webContents.send('update-progress', {
      percent: Math.round(progress.percent),
      transferred: progress.transferred,
      total: progress.total,
      bytesPerSecond: progress.bytesPerSecond
    });
  }

  private notifyUpdateReady(info: any): void {
    const response = dialog.showMessageBoxSync(this.mainWindow, {
      type: 'info',
      buttons: ['Restart Now', 'Later'],
      defaultId: 0,
      message: 'Update Ready',
      detail: `VALORANT-HUB ${info.version} has been downloaded. Restart the application to apply the update.`
    });

    if (response === 0) {
      autoUpdater.quitAndInstall();
    }
  }

  private handleUpdateError(error: Error): void {
    this.mainWindow.webContents.send('update-error', {
      message: error.message,
      code: (error as any).code
    });
  }

  public destroy(): void {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
    }
  }
}
```

### Update Flow

#### 1. Update Check Process
```typescript
// Automatic check on app startup
app.whenReady().then(() => {
  const updateManager = new UpdateManager(mainWindow);
  
  // Check for updates after 30 seconds (allow app to fully load)
  setTimeout(() => {
    updateManager.checkForUpdates();
  }, 30000);
});
```

#### 2. Version Comparison
```typescript
interface VersionInfo {
  current: string;
  available: string;
  releaseDate: string;
  critical: boolean;
}

class VersionManager {
  public compareVersions(current: string, available: string): number {
    const currentParts = current.split('.').map(Number);
    const availableParts = available.split('.').map(Number);
    
    for (let i = 0; i < Math.max(currentParts.length, availableParts.length); i++) {
      const currentPart = currentParts[i] || 0;
      const availablePart = availableParts[i] || 0;
      
      if (currentPart < availablePart) return -1;
      if (currentPart > availablePart) return 1;
    }
    
    return 0;
  }
}
```

#### 3. Download Management
```typescript
class DownloadManager {
  private downloadPath: string;
  private tempPath: string;

  constructor() {
    this.downloadPath = path.join(app.getPath('userData'), 'updates');
    this.tempPath = path.join(os.tmpdir(), 'valorant-hub-update');
  }

  public async downloadUpdate(updateInfo: any): Promise<string> {
    return new Promise((resolve, reject) => {
      autoUpdater.downloadUpdate()
        .then(() => resolve(this.downloadPath))
        .catch(reject);
    });
  }

  public verifyDownload(filePath: string, expectedHash: string): boolean {
    const fileBuffer = fs.readFileSync(filePath);
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    return fileHash === expectedHash;
  }
}
```

### Update UI Components

#### Update Notification Component
**File**: `src/renderer/components/UpdateNotification.tsx`
```tsx
import React, { useState, useEffect } from 'react';
import { Alert, Button, LinearProgress, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface UpdateInfo {
  version: string;
  releaseNotes: string;
  size: number;
}

interface UpdateProgress {
  percent: number;
  transferred: number;
  total: number;
  bytesPerSecond: number;
}

export const UpdateNotification: React.FC = () => {
  const { t } = useTranslation();
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [progress, setProgress] = useState<UpdateProgress | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for update events from main process
    window.electronAPI.onUpdateAvailable((info: UpdateInfo) => {
      setUpdateInfo(info);
    });

    window.electronAPI.onUpdateProgress((progress: UpdateProgress) => {
      setProgress(progress);
    });

    window.electronAPI.onUpdateError((error: { message: string }) => {
      setError(error.message);
      setIsDownloading(false);
    });

    return () => {
      window.electronAPI.removeAllListeners('update-available');
      window.electronAPI.removeAllListeners('update-progress');
      window.electronAPI.removeAllListeners('update-error');
    };
  }, []);

  const handleDownload = () => {
    setIsDownloading(true);
    window.electronAPI.downloadUpdate();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (error) {
    return (
      <Alert severity="error" onClose={() => setError(null)}>
        <Typography variant="body2">
          {t('update.error')}: {error}
        </Typography>
      </Alert>
    );
  }

  if (progress && isDownloading) {
    return (
      <Alert severity="info">
        <Typography variant="h6">{t('update.downloading')}</Typography>
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={progress.percent} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            {progress.percent}% - {formatBytes(progress.transferred)} / {formatBytes(progress.total)}
            {progress.bytesPerSecond > 0 && (
              <> ({formatBytes(progress.bytesPerSecond)}/s)</>
            )}
          </Typography>
        </Box>
      </Alert>
    );
  }

  if (updateInfo) {
    return (
      <Alert 
        severity="info"
        action={
          <Button 
            color="inherit" 
            size="small" 
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {t('update.download')}
          </Button>
        }
      >
        <Typography variant="h6">
          {t('update.available')} - v{updateInfo.version}
        </Typography>
        <Typography variant="body2">
          {t('update.size')}: {formatBytes(updateInfo.size)}
        </Typography>
        {updateInfo.releaseNotes && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {updateInfo.releaseNotes}
          </Typography>
        )}
      </Alert>
    );
  }

  return null;
};
```

### Error Handling

#### Network Issues
```typescript
class UpdateErrorHandler {
  public handleNetworkError(error: any): void {
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      // Show offline mode notification
      this.showOfflineNotification();
    } else if (error.code === 'ETIMEDOUT') {
      // Retry with exponential backoff
      this.scheduleRetry();
    }
  }

  private showOfflineNotification(): void {
    new Notification({
      title: 'Update Check Failed',
      body: 'Unable to check for updates. Will retry when connection is restored.',
      icon: path.join(__dirname, '../assets/icon.png')
    }).show();
  }

  private scheduleRetry(): void {
    setTimeout(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 5 * 60 * 1000); // Retry after 5 minutes
  }
}
```

#### Download Failures
```typescript
class DownloadErrorHandler {
  private retryCount = 0;
  private maxRetries = 3;

  public handleDownloadError(error: any): void {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      setTimeout(() => {
        autoUpdater.downloadUpdate();
      }, this.retryCount * 2000); // Exponential backoff
    } else {
      this.showDownloadFailedDialog();
    }
  }

  private showDownloadFailedDialog(): void {
    dialog.showErrorBox(
      'Update Download Failed',
      'Unable to download the update. Please check your internet connection and try again later.'
    );
  }
}
```

### Update Settings

#### User Preferences
```typescript
interface UpdateSettings {
  autoCheck: boolean;
  autoDownload: boolean;
  checkInterval: number; // hours
  channel: 'stable' | 'beta' | 'alpha';
  notifyOnAvailable: boolean;
}

class UpdateSettingsManager {
  private settings: UpdateSettings;

  constructor() {
    this.settings = this.loadSettings();
  }

  private loadSettings(): UpdateSettings {
    const defaultSettings: UpdateSettings = {
      autoCheck: true,
      autoDownload: false,
      checkInterval: 6,
      channel: 'stable',
      notifyOnAvailable: true
    };

    try {
      const stored = localStorage.getItem('updateSettings');
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  }

  public saveSettings(settings: Partial<UpdateSettings>): void {
    this.settings = { ...this.settings, ...settings };
    localStorage.setItem('updateSettings', JSON.stringify(this.settings));
  }

  public getSettings(): UpdateSettings {
    return { ...this.settings };
  }
}
```

### Testing Strategy

#### Unit Tests
```typescript
// tests/updater/UpdateManager.test.ts
import { UpdateManager } from '../../src/main/updater/UpdateManager';
import { BrowserWindow } from 'electron';

describe('UpdateManager', () => {
  let updateManager: UpdateManager;
  let mockWindow: jest.Mocked<BrowserWindow>;

  beforeEach(() => {
    mockWindow = {
      webContents: {
        send: jest.fn()
      }
    } as any;
    
    updateManager = new UpdateManager(mockWindow);
  });

  test('should check for updates on initialization', () => {
    expect(autoUpdater.checkForUpdatesAndNotify).toHaveBeenCalled();
  });

  test('should notify renderer when update is available', () => {
    const updateInfo = { version: '1.1.0', releaseNotes: 'Bug fixes' };
    
    updateManager['notifyUpdateAvailable'](updateInfo);
    
    expect(mockWindow.webContents.send).toHaveBeenCalledWith(
      'update-available',
      expect.objectContaining({ version: '1.1.0' })
    );
  });
});
```

#### Integration Tests
```typescript
// tests/integration/update-flow.test.ts
describe('Update Flow Integration', () => {
  test('complete update flow from check to install', async () => {
    // Mock update server response
    mockUpdateServer.setAvailableVersion('1.1.0');
    
    // Start app
    const app = await startTestApp();
    
    // Trigger update check
    await app.client.execute(() => {
      window.electronAPI.checkForUpdates();
    });
    
    // Wait for update notification
    await app.client.waitForSelector('[data-testid="update-notification"]');
    
    // Click download button
    await app.client.click('[data-testid="download-update"]');
    
    // Wait for download completion
    await app.client.waitForSelector('[data-testid="restart-prompt"]');
    
    expect(mockUpdateServer.downloadCount).toBe(1);
  });
});
```

## Deployment Pipeline

### Build Process
```yaml
# .github/workflows/build-and-release.yml
name: Build and Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        
      - name: Build installer
        run: npm run dist
        
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: installers
          path: dist/*.msi
          
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: dist/*.msi
          generate_release_notes: true
```

### Release Management
- **Semantic Versioning**: MAJOR.MINOR.PATCH
- **Release Channels**: stable, beta, alpha
- **Code Signing**: Windows Authenticode certificates
- **Release Notes**: Auto-generated from git commits
- **Rollback Strategy**: Previous version availability

This comprehensive installation and updates system ensures users always have the latest version of VALORANT-HUB with minimal friction and maximum reliability.

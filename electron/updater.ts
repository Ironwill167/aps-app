import { autoUpdater } from 'electron-updater';
import { dialog, BrowserWindow } from 'electron';
import log from 'electron-log';

// Configure logging
log.transports.file.level = 'info';
autoUpdater.logger = log;

export class AppUpdater {
  private mainWindow: BrowserWindow | null = null;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;

    // Configure the update server URL explicitly
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'Ironwill167',
      repo: 'aps-app',
      private: false,
    });

    // Debug logging
    log.info('Auto-updater initialized');
    log.info('Repository: https://github.com/Ironwill167/aps-app');
    log.info('Feed URL configured for public repository');

    this.setupEventHandlers();

    // Check for updates 10 seconds after app starts
    setTimeout(() => {
      this.checkForUpdates();
    }, 10000);

    // Check for updates every 4 hours
    setInterval(
      () => {
        this.checkForUpdates();
      },
      4 * 60 * 60 * 1000
    );
  }

  private setupEventHandlers() {
    autoUpdater.on('checking-for-update', () => {
      log.info('Checking for update...');
      this.sendUpdateStatus('checking');
    });

    autoUpdater.on('update-available', (info) => {
      log.info('Update available:', info);
      this.sendUpdateStatus('available', info.version);
    });

    autoUpdater.on('update-not-available', (info) => {
      log.info('Update not available:', info);
      this.sendUpdateStatus('not-available');
    });

    autoUpdater.on('error', (err) => {
      log.error('Error in auto-updater:', err);

      // Don't show network/auth errors to users
      if (
        err.message.includes('404') ||
        err.message.includes('401') ||
        err.message.includes('403') ||
        err.message.includes('unauthorized') ||
        err.message.includes('authentication')
      ) {
        log.info('Network/auth error - this is normal in some cases');
        this.sendUpdateStatus('not-available');
        return;
      }

      // Only show critical errors
      this.sendUpdateStatus('error', undefined, 'Unable to check for updates');
    });

    autoUpdater.on('download-progress', (progressObj) => {
      const progress = Math.round(progressObj.percent);
      log.info(`Download progress: ${progress}%`);
      this.sendUpdateStatus('downloading', undefined, undefined, progress);
    });

    autoUpdater.on('update-downloaded', (info) => {
      log.info('Update downloaded:', info);
      this.sendUpdateStatus('ready', info.version);

      // Show dialog to user
      this.showUpdateDialog(info.version);
    });
  }

  private sendUpdateStatus(status: string, version?: string, error?: string, progress?: number) {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send('update-status', {
        status,
        version,
        error,
        progress,
      });
    }
  }

  private showUpdateDialog(version: string) {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) return;

    dialog
      .showMessageBox(this.mainWindow, {
        type: 'info',
        title: 'Update Available',
        message: `A new version (${version}) has been downloaded.`,
        detail: 'Would you like to restart the application to apply the update?',
        buttons: ['Restart Now', 'Later'],
        defaultId: 0,
        cancelId: 1,
      })
      .then((result) => {
        if (result.response === 0) {
          // User clicked "Restart Now"
          autoUpdater.quitAndInstall();
        }
      });
  }

  public checkForUpdates() {
    if (process.env.NODE_ENV === 'development') {
      log.info('Skipping update check in development mode');
      return;
    }

    autoUpdater.checkForUpdatesAndNotify();
  }

  public quitAndInstall() {
    autoUpdater.quitAndInstall();
  }
}

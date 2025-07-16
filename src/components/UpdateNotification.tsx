import React, { useState, useEffect } from 'react';
import './UpdateNotification.scss';

interface UpdateInfo {
  status: string;
  version?: string;
  error?: string;
  progress?: number;
}

export const UpdateNotification: React.FC = () => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.electronAPI?.onUpdateStatus) {
      window.electronAPI.onUpdateStatus((info: UpdateInfo) => {
        setUpdateInfo(info);
        setIsVisible(true);

        // Auto-hide after 5 seconds for non-critical statuses
        if (info.status === 'checking' || info.status === 'not-available') {
          setTimeout(() => setIsVisible(false), 5000);
        }
      });
    }
  }, []);

  const handleCheckForUpdates = () => {
    if (window.electronAPI?.checkForUpdates) {
      window.electronAPI.checkForUpdates();
    }
  };

  const handleInstallUpdate = () => {
    if (window.electronAPI?.quitAndInstall) {
      window.electronAPI.quitAndInstall();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!updateInfo || !isVisible) return null;

  const getStatusMessage = () => {
    switch (updateInfo.status) {
      case 'checking':
        return 'Checking for updates...';
      case 'available':
        return `Update available: v${updateInfo.version}`;
      case 'downloading':
        return `Downloading update... ${updateInfo.progress}%`;
      case 'ready':
        return `Update ready! (v${updateInfo.version})`;
      case 'not-available':
        return 'You are using the latest version';
      case 'error':
        return `Update error: ${updateInfo.error}`;
      default:
        return 'Unknown status';
    }
  };

  const getStatusClass = () => {
    switch (updateInfo.status) {
      case 'checking':
        return 'info';
      case 'available':
        return 'warning';
      case 'downloading':
        return 'info';
      case 'ready':
        return 'success';
      case 'not-available':
        return 'success';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <div className={`update-notification ${getStatusClass()}`}>
      <div className="update-content">
        <div className="update-message">{getStatusMessage()}</div>

        {updateInfo.status === 'downloading' && updateInfo.progress && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${updateInfo.progress}%` }} />
          </div>
        )}

        <div className="update-actions">
          {updateInfo.status === 'ready' && (
            <button onClick={handleInstallUpdate} className="btn-primary">
              Install & Restart
            </button>
          )}

          {updateInfo.status === 'not-available' && (
            <button onClick={handleCheckForUpdates} className="btn-secondary">
              Check Again
            </button>
          )}

          {updateInfo.status !== 'downloading' && updateInfo.status !== 'ready' && (
            <button onClick={handleDismiss} className="btn-dismiss">
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

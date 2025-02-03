import React, { useCallback, useEffect } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const Layout: React.FC = () => {
  // Handle Right-Click to Show Electron Context Menu
  const handleRightClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    window.electronAPI.showContextMenu('nothing', 1);
  }, []);

  const handleMenuAction = useCallback(() => {}, []);

  useEffect(() => {
    window.electronAPI.onContextMenuAction(handleMenuAction);

    return () => {
      window.electronAPI.offContextMenuAction(handleMenuAction);
    };
  }, [handleMenuAction]);

  return (
    <div className="app-container" onContextMenu={handleRightClick}>
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <main className="main-content-container">
        <MainContent />
      </main>
    </div>
  );
};

export default Layout;

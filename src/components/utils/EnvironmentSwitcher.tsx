import React from 'react';
import { getCurrentEnvironment, setEnvironmentOverride, AppConfig } from '../config';

const EnvironmentSwitcher: React.FC = () => {
  const currentEnv = getCurrentEnvironment();

  if (process.env.NODE_ENV === 'production') {
    // Don't show in production builds
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: '#333',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
        fontFamily: 'monospace',
      }}
    >
      <div style={{ marginBottom: '5px' }}>
        <strong>Environment: {AppConfig.environment}</strong>
      </div>
      <div style={{ marginBottom: '5px', fontSize: '10px' }}>API: {AppConfig.apiBaseUrl}</div>
      <div style={{ display: 'flex', gap: '5px' }}>
        <button
          onClick={() => setEnvironmentOverride('development')}
          style={{
            background: currentEnv === 'development' ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            padding: '3px 6px',
            borderRadius: '3px',
            fontSize: '10px',
            cursor: 'pointer',
          }}
        >
          Dev
        </button>
        <button
          onClick={() => setEnvironmentOverride('production')}
          style={{
            background: currentEnv === 'production' ? '#dc3545' : '#6c757d',
            color: 'white',
            border: 'none',
            padding: '3px 6px',
            borderRadius: '3px',
            fontSize: '10px',
            cursor: 'pointer',
          }}
        >
          Prod
        </button>
        <button
          onClick={() => setEnvironmentOverride(null)}
          style={{
            background: '#ffc107',
            color: 'black',
            border: 'none',
            padding: '3px 6px',
            borderRadius: '3px',
            fontSize: '10px',
            cursor: 'pointer',
          }}
        >
          Auto
        </button>
      </div>
    </div>
  );
};

export default EnvironmentSwitcher;

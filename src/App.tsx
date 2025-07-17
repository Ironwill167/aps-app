import React from 'react';
import Layout from './components/Layout';
import { UpdateNotification } from './components/UpdateNotification';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App: React.FC = () => {
  return (
    <ProtectedRoute>
      <Layout />
      <UpdateNotification />
    </ProtectedRoute>
  );
};

export default App;

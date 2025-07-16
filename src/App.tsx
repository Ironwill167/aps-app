import React from 'react';
import Layout from './components/Layout';
import { UpdateNotification } from './components/UpdateNotification';

const App: React.FC = () => {
  return (
    <>
      <Layout />
      <UpdateNotification />
    </>
  );
};

export default App;

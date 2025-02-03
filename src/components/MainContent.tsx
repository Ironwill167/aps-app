import React from 'react';
import { useSelector } from 'react-redux';
import Home from './Home/Home.tsx';
import Register from './Register.tsx';
import Contacts from './Contacts/Contacts.tsx';
import Companies from './Contacts/Companies.tsx';
import FeeManagement from './Fees/FeeManagement.tsx';

const MainContent: React.FC = () => {
  const currentView = useSelector((state: any) => state.currentView);

  const renderContent = () => {
    switch (currentView) {
      case 'Home':
        return <Home />;
      case 'Register':
        return <Register />;
      case 'Contacts':
        return <Contacts />;
      case 'Companies':
        return <Companies />;
      case 'FeeManagement':
        return <FeeManagement />;
      default:
        return <Home />;
    }
  };

  return <div className="mainContentInnerContainer">{renderContent()}</div>;
};

export default MainContent;

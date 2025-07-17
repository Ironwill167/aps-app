import React from 'react';
import { useDispatch } from 'react-redux';
import { setView } from '../store';
import { useAuth } from './auth/useAuth';
import logo from '../assets/logotpbg.png';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { logout } = useAuth();

  const handleNavigation = (view: string) => {
    dispatch(setView(view));
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
    }
  };

  return (
    <div className="sidebar-content">
      <div className="sidebar-link-container">
        <button onClick={() => handleNavigation('Home')} className="SidebarLink">
          Home
        </button>
        <button onClick={() => handleNavigation('Register')} className="SidebarLink">
          Register
        </button>
        <button onClick={() => handleNavigation('FeeManagement')} className="SidebarLink">
          Fees
        </button>
        <button onClick={() => handleNavigation('Contacts')} className="SidebarLink">
          Contacts
        </button>
        <button onClick={() => handleNavigation('Companies')} className="SidebarLink">
          Companies
        </button>
        <button onClick={() => handleNavigation('Data')} className="SidebarLink">
          Data
        </button>
      </div>

      {/* User info and logout section */}
      <div className="sidebar-user-section">
        <button onClick={handleLogout} className="logout-button" title="Sign Out">
          Sign Out
        </button>
      </div>

      <img src={logo} alt="APS Logo" className="logo" />
    </div>
  );
};

export default Sidebar;

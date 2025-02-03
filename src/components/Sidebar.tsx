import React from 'react';
import { useDispatch } from 'react-redux';
import { setView } from '../store';
import logo from '../assets/logotpbg.png';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();

  const handleNavigation = (view: string) => {
    dispatch(setView(view));
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
      </div>
      <img src={logo} alt="APS Logo" className="logo" />
    </div>
  );
};

export default Sidebar;

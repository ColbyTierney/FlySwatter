import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { username, setUsername } = useUser(); // Access the username and setUsername function from UserContext
  const navigate = useNavigate();

  const handleNavigate = (to) => {
    navigate(to);
  };

  const handleLogout = (to) => {
    setUsername(''); // Set the username to an empty string when logging out
    navigate(to);
  };

  return (
    <Menu>
      <div className="menu-item">{username || 'Not Logged In'}</div>
      <button className="menu-item" onClick={() => handleNavigate('/About')}>
        About us
      </button>
      <button className="menu-item" onClick={() => handleNavigate('/Dashboard')}>
        Dashboard
      </button>
      <button className="menu-item" onClick={() => handleNavigate('/Projects')}>
        Projects
      </button>
      <button className="menu-item" onClick={() => handleLogout('/')}>
        Logout
      </button>
    </Menu>
  );
}

export default Sidebar;

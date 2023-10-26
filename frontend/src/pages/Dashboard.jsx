import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Sidebar from '../components/Sidebar';
import { useUser } from '../UserContext';

function Dashboard() {
  const { username } = useUser();
  const dashboardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
  };

  return (
    <div style={dashboardStyle}>
      <Sidebar />
      <h1 style={{ fontWeight: 'bold', marginTop: '20px' }}>Welcome, {username || 'Guest'}!</h1>
      {/* Other dashboard content */}
      <Link to="/Projects">Go to Projects</Link> {/* Change the "to" prop to "/Projects" */}
    </div>
  );
}

export default Dashboard;

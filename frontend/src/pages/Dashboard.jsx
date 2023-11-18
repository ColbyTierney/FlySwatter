import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useUser } from '../UserContext';

function Dashboard() {
  const { username } = useUser();
  const [invites, setInvites] = useState([]);

  const fetchInvites = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8081/getInvites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiver: username }),
      });
      const data = await response.json();
      setInvites(data);
    } catch (error) {
      console.error('Error fetching invites:', error);
    }
  }, [username]);

  const handleFetchInvites = async () => {
    await fetchInvites();
  };

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
      <Link to="/Projects">Go to Projects</Link>
      
      {invites.length > 0 && (
        <div>
          <h2>Invites:</h2>
          <ul>
            {invites.map((invite, index) => (
              <li key={index}>
                Sender: {invite.Sender}, Project ID: {invite.ProjectID}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Button to fetch invites */}
      <button onClick={handleFetchInvites}>View Invites</button>
    </div>
  );
}

export default Dashboard;

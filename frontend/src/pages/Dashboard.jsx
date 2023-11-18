import React, { useState } from 'react';
import { useUser } from '../UserContext';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

function Dashboard() {
  const { username } = useUser();
  const [invites, setInvites] = useState([]);

  const fetchInvites = () => {
    axios.post('http://localhost:8081/getInvites', { receiver: username })
      .then(response => {
        setInvites(response.data);
      })
      .catch(error => {
        console.error('Error fetching invites:', error);
      });
  };

  const acceptInvite = (inviteId, projectId) => {
    axios.post('http://localhost:8081/addusertoproject', { projectId, username })
      .then(response => {
        console.log('User added to project:', response.data);
        removeInvite(inviteId);
      })
      .catch(error => {
        console.error('Error accepting invite:', error);
      });
  };

  const denyInvite = (inviteId) => {
    removeInvite(inviteId);
  };

  const removeInvite = (inviteId) => {
    axios.post('http://localhost:8081/removeInvite', { inviteId })
      .then(response => {
        console.log('Invite removed:', response.data);
        fetchInvites();
      })
      .catch(error => {
        console.error('Error removing invite:', error);
      });
  };

  return (
    <div>
      <Sidebar />
      <div className="dashboard-content">
        <h1>Welcome, {username || 'Guest'}</h1>
        <button onClick={fetchInvites}>Show Invites</button>
        {invites.length > 0 && (
          <div>
            <h2>Invites:</h2>
            <ul>
              {invites.map(invite => (
                <li key={invite.InviteID}>
                  Sender: {invite.Sender}, Project ID: {invite.ProjectID}
                  <button onClick={() => acceptInvite(invite.InviteID, invite.ProjectID)}>Accept</button>
                  <button onClick={() => denyInvite(invite.InviteID)}>Deny</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

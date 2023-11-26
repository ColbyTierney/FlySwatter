import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

function Dashboard() {
  const { username } = useUser();
  const [invites, setInvites] = useState([]);

  const fetchInvites = () => {
    axios.post('http://localhost:8081/getInvites', { receiver: username })
      .then(response => {
        const updatedInvites = response.data.map(async invite => {
          const projectName = await getProjectName(invite.ProjectID);
          return {
            ...invite,
            projectName: projectName || 'Unknown Project', // Default name if fetching fails
          };
        });
        Promise.all(updatedInvites).then(invitesWithProjectNames => {
          setInvites(invitesWithProjectNames);
        });
      })
      .catch(error => {
        console.error('Error fetching invites:', error);
      });
  };

  useEffect(() => {
    fetchInvites(); // Fetch invites when component mounts
  }, [fetchInvites]); // Empty dependency array ensures it runs only once on mount
  
  // Modify getProjectName function to return a Promise
  const getProjectName = (projectId) => {
    return axios.post('http://localhost:8081/getProjectName', { projectID: projectId })
      .then(response => {
        return response.data.projectName;
      })
      .catch(error => {
        console.error('Error fetching project name:', error);
        return null;
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
        <h1 className="welcome-message">Welcome, {username || 'Guest'}</h1>
        
        <div className="invite-container">
        <h2 className="invite">Your Invitations</h2>
          <button className="show-invites-btn" onClick={fetchInvites}>Refresh</button>
          {invites.length > 0 ? (
            <div>
              
            <ul>
              {invites.map(invite => (
                <li key={invite.InviteID}>
                  <span className="sender">{invite.Sender}</span>
                  <span className="project-id">{invite.projectName}</span>
                  <div className="button-container">
                    <button className="accept-btn" onClick={() => acceptInvite(invite.InviteID, invite.ProjectID)}>Accept</button>
                    <button className="deny-btn" onClick={() => denyInvite(invite.InviteID)}>Deny</button>
                  </div>
                </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>You do not have any new invitations.</p>
          )}

        </div>
        
        
      </div>
    </div>
  );
  
}

export default Dashboard;

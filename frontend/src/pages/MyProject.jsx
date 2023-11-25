import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useProject } from '../ProjectContext';
import { useUser } from '../UserContext';
import Popup from 'reactjs-popup';
import Createticket from './CreateTicket';
import './MyProject.css';

const MyProjects = () => {
  const { projectID } = useProject();
  const [projectName, setProjectName] = useState(''); // State to store the project name
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('priority');
  const { username } = useUser();
  const [inviteError, setInviteError] = useState(null);
  const [inviteDetails, setInviteDetails] = useState({
    sender: username,
    receiver: '',
    projectId: projectID,
  });

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
  }

  const handleInviteInputChange = (e) => {
    const { name, value } = e.target;
    setInviteDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const sendInvite = (close) => {
    setInviteError(null);

    fetch('http://localhost:8081/checkUserInProject', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({
        username: inviteDetails.receiver,
        projectId: inviteDetails.projectId
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.existsInProject)
      {
        console.log('User is already in the project');
        setInviteError('User is already in the project');
      }
      else
      {
        fetch('http://localhost:8081/checkUserExists', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({
          username: inviteDetails.receiver
      }),
    })
    .then((res) => res.json())
    .then((d) => {
      if (d.exists)
      {
        console.log('User is not in the project. Sending invite...');
        fetch('http://localhost:8081/createInvite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inviteDetails),
        })
        .then((response) => response.json())
        .then((d) => {
        console.log('Invite sent successfully:', d);
        close();
        })
        .catch((error) => {
        console.error('Error sending invite', error);
        });
      }
      else
      {
        console.error('User does not exist');
        setInviteError('User does not exist');
      }
    });
      }
  });
  };

  useEffect(() => {
    const getProjectName = () => {
      // Fetch the project name associated with the project using projectID
      fetch('http://localhost:8081/getProjectName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectID }),
      })
        .then((response) => response.json())
        .then((data) => {
          setProjectName(data.projectName); // Set the project name
        })
        .catch((error) => {
          console.error('Error fetching project name:', error);
        });
    };

    getProjectName();
  }, [projectID]);

  useEffect(() => {
    const getTickets = () => {
      fetch('http://localhost:8081/getTickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectID }),
      })
        .then((response) => response.json())
        .then((data) => {
          const sortedTickets = sortTickets(data, sortCriteria);
          setTickets(sortedTickets);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching tickets:', error);
          setLoading(false);
        });
    };

    getTickets();
  }, [projectID, sortCriteria]);

  const sortTickets = (data, criteria) => {
    switch (criteria) {
      case 'priority':
        return data.sort((a, b) => a.Priority - b.Priority);
      case 'date':
        return data.sort((a, b) => new Date(a.Date_Opened) - new Date(b.Date_Opened));
      case 'alphabetical':
        return data.sort((a, b) => a.Ticket_Name.localeCompare(b.Ticket_Name));
      default:
        return data;
    }
  };

  return (
    <div>
      <Sidebar />
      <h1>{projectName}</h1> {/* Display the project name */}
      <div>
        <label className="sort-by">Sort by:</label>
        <select className="sort-by" onChange={(e) => handleSortChange(e.target.value)}>
          <option value="priority">Priority</option>
          <option value="date">Date</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>
      <button className="create-ticket" onClick={() => setVisible(true)}>
        Create Ticket
      </button>
      <Popup open={visible} onClose={() => setVisible(false)}>
        {Createticket}
      </Popup>

      <Popup
        trigger={<button className="send-invite-button">Send Invite</button>}
        modal
        nested
      >
        {(close) => (
        <div className="send-invite-popup">
        <h2 className="send-invite">Send Invite:</h2>
        <label>Receiver:</label>
        <input
          type="text"
          name="receiver"
          value={inviteDetails.receiver}
          onChange={handleInviteInputChange}
        />
        {inviteError && <div className="error-message">{inviteError}</div>}
        <button onClick={() => { sendInvite(close); }}>Send Invite</button>
        <button className="send-invite-close-button"onClick={close}>Close</button>
        </div>
  )}
</Popup>

      {loading ? (
        <p>Loading tickets...</p>
      ) : tickets === null ? (
        <p>Error loading tickets. Please try again later.</p>
      ) : tickets.length === 0 ? (
        <p>No tickets to display for this project.</p>
      ) : (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.Ticket_ID}>
              <button onClick={() => handleTicketClick(ticket)}>
                {ticket.Ticket_Name}
              </button>
            </li>
          ))}
        </ul>
      )}
      <Popup open={selectedTicket !== null} onClose={() => setSelectedTicket(null)}>
        {selectedTicket && (
          <div className="ticket-details">
            <h2>Ticket Details</h2>
            <p>Name: {selectedTicket.Ticket_Name}</p>
            <p>Description: {selectedTicket.Description}</p>
            <p>Status: {selectedTicket.Status}</p>
            <p>Priority: {selectedTicket.Priority}</p>
            <p>Date Opened: {selectedTicket.Date_Opened}</p>
            <p>Project ID: {selectedTicket.Project_ID}</p>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default MyProjects;

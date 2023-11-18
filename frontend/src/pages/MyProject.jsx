import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useProject } from '../ProjectContext';
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

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
  }

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
        <label>Sort by:</label>
        <select onChange={(e) => handleSortChange(e.target.value)}>
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

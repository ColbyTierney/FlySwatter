import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useUser } from '../UserContext';
import { useProject } from '../ProjectContext';
import { useNavigate } from 'react-router-dom';
import './CreateTicket.css';

function CreateTicket() {
  const { username } = useUser();
  const { projectID } = useProject();
  const navigate = useNavigate();

  const [ticketData, setTicketData] = useState({
    ticketName: '',
    description: '',
    status: 'Open',
    priority: '', // Initialize priority as an empty string
    dateOpened: new Date().toISOString().split('T')[0], // Use ISO date format
    createdBy: username,
    projectId: projectID,
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketData({ ...ticketData, [name]: value });
  };

  const handleAddTicket = () => {
    if (ticketData.priority === '') {
      setErrorMessage('Please select a priority');
      setSuccessMessage('');
    } else {
      fetch('http://localhost:8081/addTicket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      })
        .then((response) => {
          if (response.ok) {
            setSuccessMessage('Ticket added successfully.');
            setErrorMessage('');
            setTicketData({
              ticketName: '',
              description: '',
              status: 'Open',
              priority: '', // Reset priority to an empty string
              dateOpened: new Date().toISOString().split('T')[0],
              createdBy: username,
              projectId: projectID,
            });
            navigate('/MyProject');
          } else {
            response.json().then((data) => {
              setErrorMessage(data.error || 'Error adding the ticket.');
              setSuccessMessage('');
            });
          }
        })
        .catch((error) => {
          setErrorMessage('Network error. Please try again.');
          setSuccessMessage('');
        });
    }
  };

  return (
    <div>
      <Sidebar username={username} />
      <div>
        <h2>Add a Ticket</h2>
        <div>
          <label>Ticket Name:</label>
          <div>
            <input
              className='ticket-input'
              type="text"
              name="ticketName"
              value={ticketData.ticketName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <label>Description:</label>
          <div>
            <textarea
              className='ticket-description'
              type="text"
              name="description"
              value={ticketData.description}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <label>Priority:</label>
          <div>
            <select
              className='ticket-input'
              name="priority"
              value={ticketData.priority}
              onChange={handleInputChange}
            >
              <option value="">Select Priority</option>
              <option value={0}>Insignificant</option>
              <option value={1}>Shouldn't be an issue</option>
              <option value={2}>Needs to be addressed</option>
              <option value={3}>URGENT!!!!</option>
            </select>
          </div>
        </div>
        <div>
          <label>Date Opened:</label>
          <div>
            <input
              className='ticket-input'
              type="date"
              name="dateOpened"
              value={ticketData.dateOpened}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <button className='add-ticket-button' onClick={handleAddTicket}>
          Add Ticket
        </button>
        <p>{successMessage}</p>
        <p>{errorMessage}</p>
      </div>
    </div>
  );
}

export default CreateTicket;

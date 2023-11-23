const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: '83.229.3.59',
  user: 'root',
  password: 'Jirasuckslmfao1!',
  database: 'flyswatter',
});

app.get('/', (req, res) => {
  return res.json('From Backend Side');
});

app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM User';
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const sql = 'SELECT * FROM User WHERE Username = ? AND Password = ?';
  db.query(sql, [username, password], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (data.length === 0) {
      return res.status(401).json({ error: 'Username and password do not match' });
    }
    return res.json(data[0]);
  });
});

app.post('/register', (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: 'Name, username, email, and password are required' });
  }

  const checkSql = 'SELECT * FROM User WHERE Username = ? OR Email = ?';
  db.query(checkSql, [username, email], (checkErr, checkData) => {
    if (checkErr) {
      return res.status(500).json(checkErr);
    }

    if (checkData.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const insertSql = 'INSERT INTO User (Name, Username, Email, Password) VALUES (?, ?, ?, ?)';
    db.query(insertSql, [name, username, email, password], (insertErr, insertData) => {
      if (insertErr) {
        return res.status(500).json(insertErr);
      }

      return res.json({ message: 'User registered successfully', user: { Name: name, Username: username, Email: email } });
    });
  });
});

app.post('/addTicket', (req, res) => {
  const {
    ticketName,
    description,
    status,
    priority,
    dateOpened,
    projectId,
    createdBy,
  } = req.body;

  if (!ticketName || !description || !status || !priority || !dateOpened || !projectId || !createdBy) {
    return res.status(400).json({ error: 'All ticket fields are required' });
  }
  
  const getMaxTicketIdSql = 'SELECT MAX(Ticket_ID) AS maxTicketId FROM Tickets';
  db.query(getMaxTicketIdSql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    const maxTicketId = result[0].maxTicketId || 0;
    const newTicketId = maxTicketId + 1;

    const insertSql = 'INSERT INTO Tickets (Ticket_ID, Ticket_Name, CreatedBy, Description, Status, Priority, Date_Opened, Project_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(insertSql, [newTicketId, ticketName, createdBy, description, status, priority, dateOpened, projectId], (insertErr, insertData) => {
      if (insertErr) {
        return res.status(500).json(insertErr);
      }
      return res.json({ message: 'Ticket added successfully', newTicketId });
    });
  });
});

app.post('/getTickets', (req, res) => {
  const projectID = req.body.projectID; // Adjust the parameter name based on the frontend changes.

  if (!projectID) {
    return res.status(400).json({ error: 'projectID parameter is required' });
  }

  const sql = 'SELECT * FROM Tickets WHERE Project_ID = ?'; // Update the query to filter by Project_ID
  db.query(sql, [projectID], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.json(data);
  });
});

app.post('/getProjectID', (req, res) => {
  const { username } = req.body; // You may adjust the input parameter based on your requirements.

  if (!username) {
    return res.status(400).json({ error: 'Username parameter is required' });
  }

  const sql = 'SELECT Project_ID, Project_Name FROM Projects WHERE Usernames = ?';
  db.query(sql, [username], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (data.length === 0) {
      return res.status(404).json({ error: 'User not found in any projects' });
    }

    // Extract Project_ID and Project_Name from the result data
    const projectInfo = data.map((row) => ({ Project_ID: row.Project_ID, Project_Name: row.Project_Name }));
    return res.json({ projectInfo });
  });
});

app.post('/createProject', (req, res) => {
  const { username, projectName } = req.body;

  if (!username || !projectName) {
    return res.status(400).json({ error: 'Username and project_name are required' });
  }

  // Generate a new Project_ID by finding the maximum existing Project_ID and adding 1
  const getMaxProjectIdSql = 'SELECT MAX(Project_ID) AS maxProjectId FROM Projects';
  db.query(getMaxProjectIdSql, (maxIdErr, maxIdResult) => {
    if (maxIdErr) {
      return res.status(500).json(maxIdErr);
    }
    const maxProjectId = maxIdResult[0].maxProjectId || 0;
    const newProjectId = maxProjectId + 1;

    // Insert the new project into the database with the new Project_ID
    const insertSql = 'INSERT INTO Projects (Project_ID, Usernames, Project_Name, Owner, Admin) VALUES (?, ?, ?, ?, ?)';
    db.query(insertSql, [newProjectId, username, projectName, 1, 1], (insertErr, insertData) => {
      if (insertErr) {
        return res.status(500).json(insertErr);
      }
      return res.json({ message: 'Project created successfully', projectName, Project_ID: newProjectId });
    });
  });
});

app.post('/getProjectName', (req, res) => {
  const { projectID } = req.body;

  if (!projectID) {
    return res.status(400).json({ error: 'Project ID parameter is required' });
  }

  const sql = 'SELECT Project_Name FROM Projects WHERE Project_ID = ?';
  db.query(sql, [projectID], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (data.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const projectName = data[0].Project_Name;
    return res.json({ projectName });
  });
});

app.post('/createInvite', (req, res) => {
  const { sender, projectId, receiver } = req.body;

  if (!sender || !projectId || !receiver) {
    return res.status(400).json({ error: 'Sender, ProjectID, and Receiver are required' });
  }

  // Generate a new unique InviteID by finding the maximum existing InviteID and adding 1
  const getMaxInviteIdSql = 'SELECT MAX(InviteID) AS maxInviteId FROM Invites';
  db.query(getMaxInviteIdSql, (maxIdErr, maxIdResult) => {
    if (maxIdErr) {
      return res.status(500).json(maxIdErr);
    }
    const maxInviteId = maxIdResult[0].maxInviteId || 0;
    const newInviteId = maxInviteId + 1;

    // Insert a new invite into the database with the new InviteID, Sender, ProjectID, and Receiver
    const insertSql = 'INSERT INTO Invites (InviteID, Sender, ProjectID, Receiver) VALUES (?, ?, ?, ?)';
    db.query(insertSql, [newInviteId, sender, projectId, receiver], (insertErr, insertData) => {
      if (insertErr) {
        return res.status(500).json(insertErr);
      }
      return res.json({ message: 'Invite sent successfully', Sender: sender, ProjectID: projectId, Receiver: receiver, InviteID: newInviteId });
    });
  });
});





app.post('/getInvites', (req, res) => {
  const { receiver } = req.body;

  if (!receiver) {
    return res.status(400).json({ error: 'Receiver username is required' });
  }

  // Retrieve invites for the specified receiver
  const sql = 'SELECT * FROM Invites WHERE Receiver = ?';
  db.query(sql, [receiver], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.json(data);
  });
});

app.post('/removeInvite', (req, res) => {
  const { inviteId } = req.body;

  if (!inviteId) {
    return res.status(400).json({ error: 'InviteID is required' });
  }

  // Delete the invite based on InviteID
  const deleteSql = 'DELETE FROM Invites WHERE InviteID = ?';
  db.query(deleteSql, [inviteId], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Invite not found for this InviteID' });
    }
    return res.json({ message: 'Invite removed successfully', inviteId });
  });
});

app.post('/addusertoproject', (req, res) => {
  const { projectId, username } = req.body;
  const admin = 0;
  const owner = 0;

  if (!projectId || !username) {
    return res.status(400).json({ error: 'Project ID and username are required' });
  }

  // Fetch ProjectName based on provided Project_ID
  const selectSql = 'SELECT Project_Name FROM Projects WHERE Project_ID = ? AND Owner = 1';
  db.query(selectSql, [projectId], (selectErr, selectData) => {
    if (selectErr) {
      return res.status(500).json(selectErr);
    }

    if (selectData.length === 0) {
      return res.status(404).json({ error: 'Project not found for this Project_ID' });
    }

    const projectName = selectData[0].Project_Name;

    // Insert a new project with provided Project_ID, fetched ProjectName, username, admin, and owner set to 0
    const insertSql = 'INSERT INTO Projects (Project_ID, Usernames, Project_Name, Admin, Owner) VALUES (?, ?, ?, ?, ?)';
    db.query(insertSql, [projectId, username, projectName, admin, owner], (insertErr, insertData) => {
      if (insertErr) {
        return res.status(500).json(insertErr);
      }

      return res.json({ message: 'New project created successfully', projectName, Project_ID: projectId, admin, owner });
    });
  });
});


app.listen(8081, () => {
  console.log('Listening on port 8081');
});

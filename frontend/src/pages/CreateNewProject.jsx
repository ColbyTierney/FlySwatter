import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { useProject} from '../ProjectContext';
import './CreateNewProject.css'

function CreateNewProject() {
  const { username } = useUser();
  const [projectName, setProjectName] = useState('');
  const [message, setMessage] = useState(null);
  const projectContext = useProject();
  const { setProjectID: updateProjectID } = projectContext;
  const navigate = useNavigate();

  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8081/createProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, projectName }),
      });

      if (response.ok) {
        setMessage('Project created successfully');
        const { Project_ID } = await response.json;
        updateProjectID(Project_ID);
        navigate("/MyProject");
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to create the project');
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <Sidebar />
      <h1>Create New Project</h1>
      <form onSubmit={handleCreateProject}>
        <label> Project Name: </label>
         <div> 
          <input className='projectname'
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
         </div>
        <button className='project-submit' type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateNewProject;

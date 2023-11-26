import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useUser } from '../UserContext';
import { useProject} from '../ProjectContext';
import CreateNewProject from './CreateNewProject'
import './MyProject.css'
import Popup from 'reactjs-popup';

function Projects() {
  const { username } = useUser();
  const [projectInfo, setProjectInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const projectContext = useProject();
  const { setProjectID: updateProjectID } = projectContext;
  const [selectedProject, setSelectedProject] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmitProjectClose = () => {
    setVisible(false);
  }

  useEffect(() => {
    fetch('http://localhost:8081/getProjectID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error('Failed to retrieve project information');
        }
      })
      .then((data) => {
        setProjectInfo(data.projectInfo);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [username]);

  const handleProjectSubmit = () => {
    if (selectedProject) {
      updateProjectID(selectedProject);
      navigate('/MyProject');
    } else {
      setSubmitMessage('No project selected.');
    }
  };

  return (
    <div className="project-page">
      <Sidebar username={username} />
      <div className="top-right-button">
        <button className='create-project-button' onClick={()=>setVisible(true)}>Create Project</button>
          <Popup open={visible} onClose={()=>handleSubmitProjectClose}>
            {CreateNewProject}
          </Popup>
      </div>
      <h1>My Projects</h1>
      {loading ? (
        <p>Loading projects...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : projectInfo.length === 0 ? (
        <p>You are not part of any projects.</p>
      ) : (
        <div>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="custom-select"
          >
            <option value="">Select a project</option>
            {projectInfo.map((project) => (
              <option key={project.Project_ID} value={project.Project_ID}>
                {project.Project_Name}
              </option>
            ))}
          </select>
          <button onClick={handleProjectSubmit} className="view-project-button">
            View Project
          </button>
          {submitMessage && <p>{submitMessage}</p>}
        </div>
      )}
    </div>
  );
}

export default Projects;
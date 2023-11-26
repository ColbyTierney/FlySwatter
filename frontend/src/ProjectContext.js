import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the ProjectContext
const ProjectContext = createContext();

// Create a ProjectProvider component to wrap your app
const ProjectProvider = ({ children }) => {
  const [projectID, setProjectID] = useState(null);

  // Load the projectID from localStorage when the component mounts
  useEffect(() => {
    const savedProjectID = localStorage.getItem('projectID');
    if (savedProjectID) {
      setProjectID(savedProjectID);
    }
  }, []);

  const updateProjectID = (newProjectID) => {
    setProjectID(newProjectID);
  };

  // Update localStorage whenever the projectID changes
  useEffect(() => {
    if (projectID) {
      localStorage.setItem('projectID', projectID);
    }
  }, [projectID]);

  return (
    <ProjectContext.Provider value={{ projectID, updateProjectID }}>
      {children}
    </ProjectContext.Provider>
  );
};

// Create a custom hook to access the ProjectContext
const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export { ProjectProvider, useProject };

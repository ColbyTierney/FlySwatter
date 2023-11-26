import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the ProjectContext
const ProjectContext = createContext();

// Create a ProjectProvider component to wrap your app
const ProjectProvider = ({ children }) => {
  // Check if there's a projectID in localStorage, otherwise default to null
  const [projectID, setProjectID] = useState(
    localStorage.getItem('projectID') || null
  );

  // Update localStorage whenever projectID changes
  useEffect(() => {
    localStorage.setItem('projectID', projectID);
  }, [projectID]);

  return (
    <ProjectContext.Provider value={{ projectID, setProjectID }}>
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

import React, { createContext, useContext, useState } from 'react';

// Create the ProjectContext
const ProjectContext = createContext();

// Create a ProjectProvider component to wrap your app
const ProjectProvider = ({ children }) => {
  const [projectID, setProjectID] = useState(null);

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

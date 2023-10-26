import React, { useRef } from 'react';
import './App.css';
import Login from './Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Createticket from './pages/CreateTicket';
import About from './pages/About';
import { UserProvider } from './UserContext';
import CreateNewProject from './pages/CreateNewProject';
import { ProjectProvider } from './ProjectContext';
import MyProject from './pages/MyProject';

function App() {
  const videoRef = useRef();
  const unmuteVideo = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
    }
  };

  document.addEventListener('click', unmuteVideo);

  return (
    <Router>
      <div className="App">
        <video ref={videoRef} className="background-video" autoPlay loop muted>
          <source src="/3D Saul Goodman, Extended to Full Song, 1080p Full HD, 60fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <UserProvider>
          <ProjectProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/CreateTicket" element={<Createticket />} />
              <Route path="/Projects" element={<Projects />} />
              <Route path="/CreateNewProject" element={<CreateNewProject />} />
              <Route path="/About" element={<About />} />
              <Route path="/MyProject" element={<MyProject />} />
            </Routes>
          </ProjectProvider>
        </UserProvider>
      </div>
    </Router>
  );
}

export default App;

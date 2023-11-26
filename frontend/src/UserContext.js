import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [username, setUsername] = useState(() => {
    // Load the username from localStorage when the component mounts
    return localStorage.getItem('username') || '';
  });

  const logout = () => {
    setUsername(''); // Clear user data in the component state
    localStorage.removeItem('username'); // Remove the username from localStorage
  };

  // Update localStorage whenever the username changes
  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    }
  }, [username]);

  return (
    <UserContext.Provider value={{ username, setUsername, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

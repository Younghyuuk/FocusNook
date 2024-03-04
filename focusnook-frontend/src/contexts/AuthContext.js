// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => {
    // Initialize authToken from local storage or null if not found
    return localStorage.getItem('token') || null;
  });

  // Function to save token to local storage and state
  const login = (token) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
  };

  // Function to clear token from local storage and state
  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
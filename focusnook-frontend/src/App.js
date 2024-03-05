import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Home from './Pages/Home';
import Room from './Pages/Room';
import { AuthProvider } from './contexts/AuthContext'; 
import { ThemeProvider } from './contexts/ThemeContext'; 

function App() {
  return (
    <AuthProvider> 
      <ThemeProvider> 
      <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/Login" element={<Login/>} />
          <Route path="/SignUp" element={<SignUp/>} />
          <Route path="/Home" element={<Home/>} />
          <Route path="/Room" element={<Room/>} />
        </Routes>
      </Router>
      </ThemeProvider> 
    </AuthProvider>
  );
}

export default App;
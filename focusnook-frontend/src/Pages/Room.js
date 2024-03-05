import React, { useState, useContext, useEffect } from 'react';
import axios from "axios";
import Collaboration from '../Components/Collaboration';
import Calendar from '../Components/Calendar';
import SoundButton from '../Components/UtlityComponents/SoundButton';
import TimeDisplay from '../Components/UtlityComponents/TimeDisplay';
import Timer from '../Components/UtlityComponents/Timer';
import { useNavigate, Navigate } from 'react-router-dom'; // Import Navigate
import '../styles/Room.css';
import { useTheme } from '../contexts/ThemeContext';
import { AuthContext } from "../contexts/AuthContext";
import ToDoListRoom from '../Components/UtlityComponents/ToDoListRoom';



/**
 * The home page holds the title bar that populates tabs: collaboration, calendar, to do list themes, and account
 */
function Room() {
  const { backgroundClass, changeCurrTheme} = useTheme();
  const { authToken } = useContext(AuthContext);
  const [showTasks, setShowTasks] = useState(false); // New state for showing/hiding options
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDefaultTheme = async () => {
      try {
        const response = await axios.get("http://localhost:2000/profile", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const defaultTheme = response.data.default_theme; // Assuming default_theme is returned from the backend
        changeCurrTheme(defaultTheme); // Update the current theme
      } catch (error) {
        console.error("Error fetching default theme:", error);
      }
    };

    fetchDefaultTheme();
  }, [authToken]);


  //If authToken is not present, redirect to login page
  if (!authToken) {
    return <Navigate to="/Login" replace />;
  }

  const handleExitClick = () => {
    navigate('/Home'); // Use the navigate function to change the route
  };
  const handleTaskClick = () => {
    setShowTasks(prevShowTasks => !prevShowTasks);
  };
  
  return (
    <div className="room-page" >
       <div className={`room-container ${backgroundClass}`}>
        <div className='room-buttons'>
       <button className="exit-button" onClick={handleExitClick}>&lt;- Exit Room</button>
       <button className="task-button" onClick={handleTaskClick}> {showTasks ? 'Hide Tasks' : 'Show Tasks'} </button>
       </div>
        {showTasks && <ToDoListRoom />}
        <Timer />
        <SoundButton />
        <TimeDisplay />
      </div>
    </div>
  );
}

export default Room;
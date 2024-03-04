import React, { useState, useContext, useEffect } from 'react';
import axios from "axios";
import TopBar from '../Components/UtlityComponents/TopBar';
import Collaboration from '../Components/Collaboration';
import Calendar from '../Components/Calendar';
import Themes from '../Components/Themes';
import Account from '../Components/Account';
import SoundButton from '../Components/UtlityComponents/SoundButton';
import TimeDisplay from '../Components/UtlityComponents/TimeDisplay';
import { Navigate } from 'react-router-dom'; // Import Navigate
import Logo from '../assets/focusnook-logo.png';
import '../styles/Home.css';
import { useTheme } from '../contexts/ThemeContext';
import { AuthContext } from "../contexts/AuthContext";



/**
 * The home page holds the title bar that populates tabs: collaboration, calendar, to do list themes, and account
 */
function HomePage() {
  const [activeTab, setActiveTab] = useState(''); // Default to no tab
  const { backgroundClass, changeCurrTheme } = useTheme();
  const { authToken } = useContext(AuthContext);

  
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


  // Function to handle closing of the overlay content
  const handleCloseClick = () => {
    setActiveTab('');
  };

  // Close button definition
  const closeButton = (
    <button className="close-button" onClick={handleCloseClick}>
      &times;
    </button>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'collaboration':
        return <Collaboration />;
      case 'calendar':
        return <Calendar />;
      case 'themes':
        return <Themes />;
      case 'account':
        return <Account />;


      // ... cases for other components
      default:
        return null; // Return nothing if no tab is active
    }
  };

  return (
    <div className="home-page" >
       <div className={`home-container ${backgroundClass}`}>
        <TopBar setActiveTab={setActiveTab} />
        
        {/* Render the permanent content only if there is no active tab */}
        {!activeTab && (
          <div className="permanent-content">
            <img src={Logo} alt="FocusNook-Logo" className='Logo'/>
            <button className='permanent-button'>ENTER ROOM</button>
          </div>
        )}

        {/* Overlay content - shown when a tab is active */}
        {activeTab && (
          <div className="overlay-content">
            {closeButton} 
            {renderContent()}
          </div>
        )}
        
        <SoundButton />
        <TimeDisplay />
      </div>
    </div>
  );
}

export default HomePage;
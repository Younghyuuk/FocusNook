import React, { useState } from 'react';
import TopBar from '../Components/UtlityComponents/TopBar';
import Collaboration from '../Components/Collaboration';
import Calendar from '../Components/Calendar';
import SoundButton from '../Components/UtlityComponents/SoundButton';
import TimeDisplay from '../Components/UtlityComponents/TimeDisplay';
import Logo from '../assets/focusnook-logo.png';
import '../styles/Home.css';

/**
 * The home page holds the title bar that populates tabs: collaboration, calendar, to do list themes, and account
 */
function HomePage() {
  const [activeTab, setActiveTab] = useState(''); // Default to no tab

  const renderContent = () => {
    switch(activeTab) {
      case 'collaboration':
        return <Collaboration />;
      case 'calendar':
        return <Calendar />;
      // ... cases for other components
      default:
        return null; // Return nothing if no tab is active
    }
  };

  return (
    <div className="home-page">
      <div className='home-container'> 
        <TopBar setActiveTab={setActiveTab} />
        
        {/* Permanent content */}
        <div className="permanent-content">
        <img src={Logo} alt="FocusNook-Logo" className='Logo'/>
        <button className='permanent-button'>ENTER ROOM</button>
        </div>

        {/* Overlay content - shown when a tab is active */}
        {activeTab && (
          <div className="overlay-content">
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
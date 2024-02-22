import React from 'react';
import '../../styles/TopBar.css'; 

function TopBar({ setActiveTab }) {
  return (
    <div className="top-bar">
      <button onClick={() => setActiveTab('collaboration')} className="top-bar-item">Collaboration</button>
      <button onClick={() => setActiveTab('calendar')} className="top-bar-item">Calendar</button>
      <button onClick={() => setActiveTab('to-do-list')} className="top-bar-item">To-Do List</button>
      <button onClick={() => setActiveTab('themes')} className="top-bar-item">Themes</button>
      <button onClick={() => setActiveTab('account')} className="top-bar-item">Account</button>
    </div>
  );
}

export default TopBar;


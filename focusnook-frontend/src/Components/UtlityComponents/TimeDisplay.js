// TimeDisplay.js
import React, { useState, useEffect } from 'react';
import '../../styles/TimeDisplay.css'; 

function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="time-display">
      {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
    </div>
  );
}

export default TimeDisplay;
import React, { useState, useEffect } from 'react';
import '../../styles/Timer.css'; 

function Timer() {
    const [showOptions, setShowOptions] = useState(false); // New state for showing/hiding options
    const [duration, setDuration] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
  
    useEffect(() => {
        // Only set up the interval when the timer is running
        if (isRunning) {
          const id = setInterval(() => {
            setRemainingTime((prevTime) => {
              if (prevTime <= 1) {
                clearInterval(id);
                setIsRunning(false);
                setShowOptions(false);
                return 0;
              }
              return prevTime - 1;
            });
          }, 1000);
      
          // Clear this interval when the effect re-runs or the component unmounts
          return () => clearInterval(id);
        }
      }, [isRunning]);
  
    const startTimer = (time) => {
      setDuration(time);
      setRemainingTime(time);
      setIsRunning(true);
      setShowOptions(false); // Hide options once the timer starts
    };
  
    const pauseTimer = () => {
      setIsRunning(false);
      clearInterval(intervalId);
    };
  
    const resetTimer = () => {
      setIsRunning(false);
      setRemainingTime(0);
      setDuration(0);
      clearInterval(intervalId);
    };
  
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };
  
    return (
      <div className="timer">
        {!isRunning && duration === 0 && !showOptions && (
          <button className= "set-timer-btn" onClick={() => setShowOptions(true)}>SET TIMER</button>
        )}
        <div className="timer-options">
        {!isRunning && showOptions && (
            <>
            <button onClick={() => startTimer(1800)}>30 Minutes</button>
            <button onClick={() => startTimer(2700)}>45 Minutes</button>
            <button onClick={() => startTimer(3600)}>1 Hour</button>
            </>
        )}
        </div>
        <div className="timer-display">
          {duration > 0 && <p className ="remaining-time"> Remaining Time</p>}
          {duration > 0 && <p className="remaining-time-timer">{formatTime(remainingTime)}</p>}
        </div>
        <div className='pause-reset'>
        {isRunning && (
          <>
            <button className= "pause-btn" onClick={pauseTimer}>Pause</button>
            <button className= "reset-btn" onClick={resetTimer}>Reset</button>
          </>
        )}
        {!isRunning && duration !== 0 && (
          <>
            <button className= "pause-btn" onClick={() => setIsRunning(true)}>Resume</button>
            <button className= "reset-btn" onClick={resetTimer}>Reset</button>
          </>
        )}
        </div>
      </div>
    );
  }
  
  export default Timer;

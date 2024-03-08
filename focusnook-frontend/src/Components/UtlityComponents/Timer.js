import React, { useState, useEffect, useContext } from 'react';
import '../../styles/Timer.css'; 
import axios from "axios";
import { useSelectedTask } from './SelectedTaskContext';
import { AuthContext } from '../../contexts/AuthContext';

function Timer() {
    const [showOptions, setShowOptions] = useState(false); // New state for showing/hiding options
    const [duration, setDuration] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const { selectedTaskId } = useSelectedTask();
    const { authToken } = useContext(AuthContext);
  
    useEffect(() => {
      if (isRunning) {
        // Set up the interval
        const id = setInterval(() => {
          setRemainingTime((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(intervalId); // Clear using intervalId from the state
              setIsRunning(false);
              setShowOptions(false);
              if (selectedTaskId) { // Check if selectedTaskId is not null
                const timeSpent = duration; // prevTime is <= 1, so we can use duration
                updateTaskWorkTime(selectedTaskId, timeSpent); // Log the time spent on the current task
              }
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
        setIntervalId(id); // Save the interval ID to the state
      }
      // Clean up function
      return () => {
        if (intervalId) {
          clearInterval(intervalId); // Clear using intervalId from the state
        }
      };
    }, [isRunning]); // Removed intervalId, duration, selectedTaskId from dependencies
    
  
      const startTimer = (time) => {
        const now = new Date(); // Get the current time
        setStartTime(now);      // Set the start time
        setDuration(time);
        setRemainingTime(time);
        setIsRunning(true);
        setShowOptions(false);  // Hide options once the timer starts
      };
      
      const pauseTimer = () => {
        clearInterval(intervalId); // Use intervalId from state
        setIsRunning(false);
        const now = new Date(); 
        console.log(selectedTaskId);
        if (startTime && selectedTaskId) { // Ensure startTime and selectedTaskId are not null
          const timeSpent = Math.floor((now - startTime) / 1000);
          updateTaskWorkTime(selectedTaskId, timeSpent);
        }
      };
  
    const resetTimer = () => {
      clearInterval(intervalId);
      setIsRunning(false);
      setRemainingTime(0);
      setDuration(0);
    };
  
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const updateTaskWorkTime = async (taskId, additionalTime) => {
      try {
        const response = await axios.patch(`http://localhost:2000/task/worktime/${taskId}`, {
          additionalTime
        }, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('Task work time updated:', response.data);
      } catch (error) {
        console.error('Error updating task work time:', error);
      }
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

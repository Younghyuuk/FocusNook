import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TaskItem from '../UtlityComponents/TaskItem'; // Make sure to create this component
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/ToDoListRoom.css';

function ToDoListRoom() {
  const { authToken } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    // Define the timeframe as 'nextweek' since we want tasks for this week
    fetchTasks('nextweek');
  }, []); // The empty array ensures this effect runs once after the initial render

  const fetchTasks = async (timeframe) => {
    // Since the timeframe is always 'nextweek', we use a static endpoint
    const endpoint = '/tasks/nextweek';
    try {
      const response = await axios.get(`http://localhost:2000${endpoint}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <div className="todo-container">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} fetchTasks={() => fetchTasks('nextweek')} />
      ))}
    </div>
  );
}

export default ToDoListRoom;
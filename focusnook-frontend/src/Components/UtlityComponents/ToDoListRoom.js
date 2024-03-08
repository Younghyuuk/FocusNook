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
    const endpoint = '/tasks/nextweek';
    try {
      const response = await axios.get(`http://localhost:2000${endpoint}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const sortedTasks = response.data.sort((a, b) => 
        new Date(a.due_date) - new Date(b.due_date)
      );
      setTasks(sortedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
  <div className="todo-container">
    <div className="task-items-wrapper">
        {tasks.map((task) => (
            <TaskItem key={task._id} task={task} fetchTasks={() => fetchTasks('nextweek')} />
        ))}
    </div>
</div>
  );
}

export default ToDoListRoom;
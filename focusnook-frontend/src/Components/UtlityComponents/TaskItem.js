// TaskItem.js
import React, { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/TaskItem.css';; // Your CSS file for styling

function TaskItem({ task, fetchTasks, filter }) {
  const { authToken } = useContext(AuthContext);

  const markAsComplete = async (taskId) => {
    try {
      await axios.patch(`http://localhost:2000/task/complete/${taskId}`, {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      fetchTasks(filter);
    } catch (error) {
      console.error('Error marking task as complete:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.patch(`http://localhost:2000/task/drop/${taskId}`, {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      fetchTasks(filter);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

   // Convert start date to local date string
   const localStartDate = new Date(task.start_date).toLocaleDateString('en-US', {
    timeZone: 'UTC',
  });

  // Convert due date to local date string
  const localDueDate = new Date(task.due_date).toLocaleDateString('en-US', {
    timeZone: 'UTC',
  });

  return (
    <div className="task-item">
      <div className="task-details">
        <h3>{task.desc}</h3>
        <p>Start: {localStartDate}</p>
        <p>Due: {localDueDate}</p>
      </div>
      <div className="task-actions">
        <button className="complete" onClick={() => markAsComplete(task._id)}>✓</button>
        <button className="delete" onClick={() => deleteTask(task._id)}>✘</button>
      </div>
    </div>
  );
}


export default TaskItem;
// TaskItem.js
import React, { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/TaskItem.css';; // Your CSS file for styling

function TaskItem({ task, fetchTasks, filter, onSelect, isSelected }) {
  const { authToken } = useContext(AuthContext);
  const taskItemClasses = `task-item ${isSelected ? 'selected' : ''}`;

  // Function to get the user's calendar ID
  const getCalendarId = async () => {
    try {
      const response = await axios.get('http://localhost:2000/profile/calendarId', {
          headers: { Authorization: `Bearer ${authToken}` },
          });
          console.log('Calendar ID retrieved successfully.');
          console.log(response.data.calendarId);
          return response.data.calendarId;
        } catch (error) {
          throw new Error('Failed to retrieve calendar ID');
        }
    };

    // Function to get the tasks event ID
    const getEventId = async (taskId) => {
      try {
        const response = await axios.get(`http://localhost:2000/task/event/${taskId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
            });
            console.log('Event ID retrieved successfully.');
            console.log(response.data.eventId);
            return response.data.eventId;
          } catch (error) {
            throw new Error('Failed to retrieve event ID');
          }
      }; 

    // Function to delete event associated with task
    const deleteEvent = async (calendarId, eventId) => {
      try {
         await axios.delete(`http://localhost:2000/calendarId/${calendarId}/${eventId}`,
            );
            console.log('Event deleted successfully.');
          } catch (error) {
            throw new Error('Failed to delete event');
          }
      };  
  const markAsComplete = async (taskId) => {
    try {
      await axios.patch(`http://localhost:2000/task/complete/${taskId}`, {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      fetchTasks(filter);
      const calendarId = await getCalendarId();
      const eventId = await getEventId(taskId);
      await deleteEvent(calendarId, eventId);
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
      const calendarId = await getCalendarId();
      const eventId = await getEventId(taskId);
      await deleteEvent(calendarId, eventId);
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

  const handleActionButtonClick = (e, action) => {
    e.stopPropagation(); // Prevent click from bubbling up and triggering onSelect
    action(task._id);
  };

  return (
    <div className={taskItemClasses}>
      <div className="task-details" onClick={() => onSelect(task._id)}>
        <h3>{task.desc}</h3>
        <p>Start: {localStartDate}</p>
        <p>Due: {localDueDate}</p>
      </div>
      <div className="task-actions">
        <button
          className="complete"
          onClick={(e) => handleActionButtonClick(e, markAsComplete)}
        >
          ✓
        </button>
        <button
          className="delete"
          onClick={(e) => handleActionButtonClick(e, deleteTask)}
        >
          ✘
        </button>
      </div>
    </div>
  );
}


export default TaskItem;
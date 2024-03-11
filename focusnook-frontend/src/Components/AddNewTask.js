import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/AddNewTask.css'; // Make sure this path is correct

function AddNewTask() {
  const { authToken } = useContext(AuthContext);
  const [taskDesc, setTaskDesc] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Helper function to clear messages when the user starts typing again
  const clearMessages = () => {
    if (statusMessage || errorMessage) {
      setStatusMessage('');
      setErrorMessage('');
    }
  };

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
  
    // Function to create an event in the user's calendar
    const addToCalendar = async (calendarId, newTask) => {
      const formattedStartDate = `${newTask.start_date}T00:00:01Z`;
      const formattedEndDate = `${newTask.due_date}T00:00:01Z`;
      console.log(formattedStartDate);
      console.log(formattedEndDate);
      console.log(newTask.desc);
      try {
        const response = await axios.post(`http://localhost:2000/calendar/${calendarId}`, {
          startTime: formattedStartDate,
          endTime: formattedEndDate,
          title: newTask.desc,
        });
        console.log('Task added to calendar successfully.');
        return response.data.id;
      } catch (error) {
        throw new Error('Failed to add task to calendar');
      }
    };

        // Function to update an eventId in tasks
        const updateEventId = async (taskId, eventId) => {
          try {
            await axios.patch(`http://localhost:2000/task/event/${taskId}`, {
              eventId : eventId
            }, {
              headers: { Authorization: `Bearer ${authToken}` },
            });
            console.log('Task updated event id successfully.');
          } catch (error) {
            throw new Error('Failed to update event id');
          }
        };

    const handleAddTask = async (e) => {
      e.preventDefault();
  
      // Clear any existing messages
      clearMessages();
  
      // Validate dates
if (new Date(startDate) >= new Date(dueDate)) {
  setErrorMessage('The due date must be strictly after the start date.');
  return;
}
  
      try {
        const newTask = {
          completed: false,
          desc: taskDesc,
          dropped: false,
          start_date: startDate,
          due_date: dueDate,
        };
  
        // Create the task
        const taskResponse = await axios.post('http://localhost:2000/task', newTask, {
        headers: { Authorization: `Bearer ${authToken}` },
        });
        const newTaskId = taskResponse.data._id; 
        console.log(newTaskId);


        // Retrieve the user's calendar ID
        const calendarId = await getCalendarId();
        console.log(calendarId);
        // Add the task to the user's calendar
        const eventId = await addToCalendar(calendarId, newTask);
        console.log(eventId);
        await updateEventId(newTaskId, eventId)
  
        // Task added successfully
        setStatusMessage('Task added successfully!');
  
        // Clear the form fields
        setTaskDesc('');
        setStartDate('');
        setDueDate('');
      } catch (error) {
        setErrorMessage(error.message || 'Failed to add task');
      }
    };

  return (
    <div className="add-task-main-container">
      <h1>Add New Task</h1>
      <form onSubmit={handleAddTask} className="add-task-container form">
        <div className="form-group">
          <label htmlFor="taskDesc">Description</label>
          <input
            type="text"
            id="taskDesc"
            value={taskDesc}
            onChange={(e) => { setTaskDesc(e.target.value); clearMessages(); }}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); clearMessages(); }}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => { setDueDate(e.target.value); clearMessages(); }}
            required
          />
        </div>

        {statusMessage && <div className="message-container"><p className="success-message">{statusMessage}</p></div>}
        {errorMessage && <div className="message-container"><p className="error-message">{errorMessage}</p></div>}

        <div className="button-container">
          <button type="submit">Add Task</button>
        </div>
      </form>
    </div>
  );
}

export default AddNewTask;
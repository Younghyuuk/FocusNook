import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import TaskItem from '../Components/UtlityComponents/TaskItem';
import '../styles/TodoList.css';

function TodoList() {
  const { authToken } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('today'); // 'today' or 'nextweek'

  useEffect(() => {
    fetchTasks(filter);
  }, [filter]); // Re-fetch tasks when filter changes

  const fetchTasks = async (timeframe) => {
    const endpoint = timeframe === 'today' ? '/tasks/today' : '/tasks/nextweek';
    try {
      const response = await axios.get(`http://localhost:2000${endpoint}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      // Sort tasks by due date
      const sortedTasks = response.data.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
      setTasks(sortedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <div className="todo-list-wrapper">
      <h1 className="todo-list-title">To-Do List</h1>
      <div className="todo-list-container">
        <div className="filter-buttons">
          <button onClick={() => setFilter('today')}>Today</button>
          <button onClick={() => setFilter('nextweek')}>This Week</button>
        </div>
        <div className="tasks-container">
          {tasks.map((task) => (
            <TaskItem key={task._id} task={task} fetchTasks={fetchTasks} filter={filter} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TodoList;
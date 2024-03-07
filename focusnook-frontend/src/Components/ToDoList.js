import React, { useState } from 'react';
//import '../styles/Tasks.css'; // Path to your CSS file for this component

const initialTasks = [
  { id: 1, title: 'Finish UI design', description: 'Working With: Amanda', dueDate: '2/1/2024' },
  { id: 2, title: 'Finish OS Homework', description: 'Working With: Remy', dueDate: '2/28/2024' },
  // ... other tasks
];

function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);

  return (
    <div className="tasks-main-container">
      <h1>To-Do List</h1>
      <div className="tasks-container">
        {tasks.map((task) => (
          <div key={task.id} className="task">
            <div className="task-details">
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <p className="due-date">Due: {task.dueDate}</p>
            </div>
            <div className="task-actions">
              <button className="complete-button">✔️</button>
              <button className="delete-button">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;
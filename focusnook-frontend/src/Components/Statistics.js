import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Statistics.css'

const Statistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    averageWorkTime: 0,
    completionRate: 0
  });

  useEffect(() => {
    const fetchTaskStatistics = async () => {
      try {
        const response = await axios.post('http://localhost:2000/task-statistics');
        setStats({
          totalUsers: response.data.totalUsers,
          averageWorkTime: response.data.taskStatistics.averageWorkTime,
          completionRate: response.data.taskStatistics.completionRate
        });
      } catch (error) {
        console.error('Failed to fetch task statistics:', error);
      }
    };

    fetchTaskStatistics();
  }, []);

  return (
    <div className="statistics-container">
      <h1>Statistics</h1>
      <table className="statistics-table">
        <thead>
          <tr>
            <th>Statistic</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Users</td>
            <td>{stats.totalUsers}</td>
          </tr>
          <tr>
            <td>Average Work Time</td>
            <td>{stats.averageWorkTime ? stats.averageWorkTime.toFixed(2) + ' minutes' : 'N/A'}</td>
          </tr>
          <tr>
            <td>Completion Rate</td>
            <td>{stats.completionRate ? (stats.completionRate * 100).toFixed(2) + '%' : 'N/A'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Statistics;
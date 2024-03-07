const mongoose = require('mongoose');
const Task = require('./Task'); // Assuming Task.js is in the same directory

class TaskStatistics {
  static async averageTasksPerUser() {
    // Aggregate pipeline to calculate the average number of tasks assigned to users
    const pipeline = [
      { $unwind: "$assigned_users" },
      { $group: { _id: "$assigned_users", totalTasks: { $sum: 1 } } },
      { $group: { _id: null, averageTasks: { $avg: "$totalTasks" } } }
    ];
    
    try {
      const result = await Task.aggregate(pipeline);
      return result.length > 0 ? result[0].averageTasks : 0;
    } catch (error) {
      console.error("Error calculating average tasks per user:", error);
      throw error;
    }
  }

  static async averageCompletedTasks() {
    // Aggregate pipeline to calculate the average number of completed tasks
    const pipeline = [
      { $group: { _id: null, totalCompleted: { $sum: { $cond: ["$completed", 1, 0] } }, totalTasks: { $sum: 1 } } },
      { $project: { _id: 0, averageCompleted: { $divide: ["$totalCompleted", "$totalTasks"] } } }
    ];
    
    try {
      const result = await Task.aggregate(pipeline);
      return result.length > 0 ? result[0].averageCompleted : 0;
    } catch (error) {
      console.error("Error calculating average completed tasks:", error);
      throw error;
    }
  }
}

module.exports = TaskStatistics;

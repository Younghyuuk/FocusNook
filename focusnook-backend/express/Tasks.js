const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  assigned_user: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'User' 
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
  date_added: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  dropped: {
    type: Boolean,
    required: true,
    default: false,
  },
  work_time: {
    type: Number,
    required: true,
    default: 0,
  },
  start_date: {
    type: Date,
    required: true,
  },
  due_date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Task', taskSchema);
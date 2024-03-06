const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  assigned_users: {
    type: [String],
    required: true,
    minlength: 1,
  },
  completed: {
    type: Boolean,
    required: true,
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
    type: Number,
    required: true,
  },
  ongoing: {
    type: Number,
    required: true,
  },
  progress: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  work_time: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Task', taskSchema);
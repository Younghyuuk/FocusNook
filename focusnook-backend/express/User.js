const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  ongoing_tasks: {
    type: Number,
    default: 0
  },
  completed_tasks: {
    type: Number,
    default: 0
  },
  dropped_tasks: {
    type: Number,
    default: 0
  }
  
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;

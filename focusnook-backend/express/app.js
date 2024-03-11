const express = require('express');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Require the CORS module
const swaggerJSdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// this connects to mongoDB
require('./db');
const User = require('./User');
const Task = require('./Tasks');

const app = express();
const port = 2000;
// define the Swagger JS DOC configuration
const APIDocOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FocusNook API',
      version: '1.0.0',
      description: 'An API for efficient task management and collaboration using express and MongoDB.',
      servers: ['http://localhost:' + port]
    },
  },
  apis: ['./express/app.js', './express/User.js', './express/Tasks.js'],
};

// initialize the swagger-jsdoc
const APIDocs = swaggerJSdoc(APIDocOptions);
// for calendar api
const API_KEY = '';
// for email api
const EMAIL_API_KEY = '';

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000' // This will allow your frontend server to access the backend
}));


/**
 * @swagger
 * /users/count:
 *   get:
 *     summary: Get user count
 *     description: Retrieve the total number of users in the database.
 *     tags:
 *         - User
 *     responses:
 *       200:
 *         description: A count of the users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 100
 *       500:
 *         description: Error connecting to the database or counting documents.
 */
app.get('/users/count', async (req, res) => {
  try {
    // Assuming User is a Mongoose model you've already defined
    const count = await User.countDocuments(); // Mongoose method to count documents
    res.json({ count: count });
  } catch (err) {
    console.error(err.stack); // More detailed error logging
    res.status(500).send('Error connecting to the database or counting documents.');
  }
});

/**
 * @swagger
 *  /register:
 *  post:
 *       summary: Register a new user
 *       description: Create a new user account.
 *       tags:
 *            - User  
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - username
 *                 - email
 *                 - password
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 password:
 *                   type: string
 *                   format: password
 *       responses:
 *         201:
 *           description: User registered successfully
 *         500:
 *           description: Internal server error
 */
  app.post('/register', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
      const newUser = await user.save();
      res.status(201).json({ userId: newUser._id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  
  /**
   * @swagger
   * /login:
   *   post:
   *     summary: Authenticate a user
   *     description: Log in with email and password to receive an authentication token.
   *     tags:
   *           - User  
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 format: password
   *     responses:
   *       200:
   *         description: User logged in successfully
   *       401:
   *         description: Invalid credentials
   *       500:
   *         description: Internal server error
   */
  app.post('/login', async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user && await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });
        res.json({ token: token });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  
  /**
   * @swagger
   * components:
   *   securitySchemes:
   *     bearerAuth:
   *       type: http
   *       scheme: bearer
   *       bearerFormat: JWT
   * security:
   *   - bearerAuth: []
   */
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, 'your_secret_key', (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };
  
  /**
   * @swagger
   * /profile:
   *   get:
   *     summary: Retrieve user profile information
   *     description: Returns user profile information for the authenticated user.
   *     tags:
   *         - User
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successfully retrieved user profile information.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                 username:
   *                   type: string
   *                 email:
   *                   type: string
   *       401:
   *         description: Authorization information is missing or invalid.
   *       403:
   *         description: Access token is expired or invalid.
   *       500:
   *         description: Internal server error.
   */
  app.get('/profile', authenticateToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  /**
   * @swagger
   * /profile/update:
   *   put:
   *     summary: Update user profile
   *     description: Allows authenticated users to update their profile information.
   *     tags:
   *          - User
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 format: password
   *     responses:
   *       200:
   *         description: Successfully updated user profile.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       401:
   *         description: Unauthorized - Token not provided or invalid.
   *       403:
   *         description: Forbidden - Token is no longer valid.
   *       500:
   *         description: Internal server error.
   * components:
   *   schemas:
   *     User:
   *       type: object
   *       properties:
   *         username:
   *           type: string
   *         email:
   *           type: string
   *         password:
   *           type: string
   */
 app.put('/profile/update', authenticateToken, async (req, res) => {
  try {
    // Extract email field from req.body
    const { email, ...updateData } = req.body;
    
    // If password is included in update data, hash it before updating
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Update the user profile excluding the email field
    const updatedUser = await User.findByIdAndUpdate(req.user.userId, updateData, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/**
 * @swagger
 * /profile/default-theme:
 *   put:
 *     summary: Update user's default theme
 *     description: Allows authenticated users to update their default theme.
 *     tags:
 *          - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               default_theme:
 *                 type: string
 *     responses:
 *       200:
 *         description: Default theme updated successfully.
 *       500:
 *         description: Internal Server Error
 */

// Update user default theme route
app.put('/profile/default-theme', authenticateToken, async (req, res) => {
  try {
    const { default_theme } = req.body; // Extract default_theme field from req.body
    
    // Update the user's default theme
    const updatedUser = await User.findByIdAndUpdate(req.user.userId, { default_theme }, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /profile/calendarId:
 *   get:
 *     summary: Retrieve the calendar ID associated with the user's profile
 *     description: Fetch the calendar ID from the authenticated user's profile.
 *     tags:
 *          - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the calendar ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 calendarId:
 *                   type: string
 *                   description: The calendar ID associated with the user's profile.
 *       404:
 *         description: Calendar ID not found for the user.
 *       500:
 *         description: Internal server error.
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// Retrieve user's calendar ID
app.get('/profile/calendarId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user && user.calendarId) {
      res.json({ calendarId: user.calendarId });
    } else {
      res.status(404).json({ error: 'Calendar ID not found for the user' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


  /**
 * @swagger
 * /profile/calendarId/{id}:
 *   put:
 *     summary: Update a user's calendar ID
 *     description: Updates the specified user's calendar ID.
 *     tags:
 *         - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               calendarId:
 *                 type: string
 *                 description: The new calendar ID to be updated for the user
 *     responses:
 *       200:
 *         description: User's calendar ID updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The user ID
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         calendarId:
 *           type: string
 *           description: The calendar ID associated with the user
 */
app.put('/profile/calendarId/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { calendarId } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, { calendarId: calendarId }, { new: true });

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});





//////////////////////CALENDAR SERVICES////////////////////////////


/**
 * @swagger
 * /calendar/create:
 *   post:
 *     summary: Create a unique calendar for a user
 *     description: This endpoint creates a unique calendar for a user by making a POST request to an external calendar service.
 *     tags:
 *         - Calendar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the calendar.
 *               description:
 *                 type: string
 *                 description: Description of the calendar.
 *     responses:
 *       201:
 *         description: Calendar created successfully.
 *       500:
 *         description: Error creating calendar.
 */
// Create calendar (unique to each user)
app.post('/calendar/create', async (req, res) => {
  const calendarOptions = {
    method: 'POST',
    url: 'https://calendar22.p.rapidapi.com/v1/calendars',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': API_KEY, // Replace with your actual API key
      'X-RapidAPI-Host': 'calendar22.p.rapidapi.com'
    },
    data: req.body // Pass through the client-provided data
  };

  try {
    const response = await axios.request(calendarOptions);
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /calendar/{calendarId}:
 *   get:
 *     summary: Get a calendar by ID
 *     description: Retrieves a calendar's details by its ID from an external calendar service.
 *     tags:
 *          - Calendar
 *     parameters:
 *       - in: path
 *         name: calendarId
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the calendar to retrieve.
 *     responses:
 *       200:
 *         description: Calendar data retrieved successfully.
 *       500:
 *         description: Error retrieving calendar data.
 */
app.get('/calendar/:calendarId', async (req, res) => {
  const calendarId = req.params.calendarId; // Extract the calendar ID from the URL parameter

  const options = {
    method: 'GET',
    url: `https://calendar22.p.rapidapi.com/v1/calendars/${calendarId}`,
    headers: {
      'X-RapidAPI-Key': API_KEY, // Replace this with your actual API key
      'X-RapidAPI-Host': 'calendar22.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /calendar/{calendarId}:
 *   post:
 *     summary: Create an event on a calendar
 *     description: Adds a new event to a specified calendar by ID.
 *     tags:
 *          - Calendar
 *     parameters:
 *       - in: path
 *         name: calendarId
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the calendar where the event will be added.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Start time of the event.
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: End time of the event.
 *               title:
 *                 type: string
 *                 description: Title of the event.
 *     responses:
 *       200:
 *         description: Event created successfully.
 *       500:
 *         description: Error creating event.
 */
// Create event on calendar
app.post('/calendar/:calendarId', async (req, res) => {
  const calendarId = req.params.calendarId;

  const { startTime, endTime, title } = req.body;

  const options = {
    method: 'POST',
    url: `https://calendar22.p.rapidapi.com/v1/calendars/${calendarId}/events`,
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'calendar22.p.rapidapi.com'
    },
    data: JSON.stringify({
      startTime: startTime,
      endTime: endTime,
      title: title,
    })
  };
  
  try {
    const response = await axios.request(options);
    console.log(response.data);
    res.json(response.data); // Send back the response from the API to the client
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred'); // Send a server error response to the client
  }
});

/**
 * @swagger
 * /calendarId/{calendarId}/events:
 *   get:
 *     summary: Read calendar events within a specific time range
 *     description: Retrieves events from a specified calendar by ID within a given start and end time.
 *     tags:
 *          - Calendar
 *     parameters:
 *       - in: path
 *         name: calendarId
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the calendar to retrieve events from.
 *       - in: query
 *         name: startTime
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           description: Start time for filtering events.
 *       - in: query
 *         name: endTime
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           description: End time for filtering events.
 *     responses:
 *       200:
 *         description: Events retrieved successfully.
 *       500:
 *         description: Error retrieving events.
 */
// Read calendar event
app.get('/calendarId/:calendarId/events', async (req, res) => {
  const calendarId = req.params.calendarId; // Extract the calendar ID from the URL parameter
  const { startTime, endTime } = req.query; // Should be req.query for GET requests

  const options = {
    method: 'GET',
    url: `https://calendar22.p.rapidapi.com/v1/calendars/${calendarId}/events`,
    params: {
      startTime: startTime,
      endTime: endTime
    },
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'calendar22.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});



/**
 * @swagger
 * /task-statistics:
 *   post:
 *     summary: Retrieves aggregated task statistics
 *     description: Returns the average work time and completion rate for tasks, along with the total number of users in the system. Intended for admin use.
 *     tags:
 *          - Statistics
 *     responses:
 *       200:
 *         description: Successfully retrieved task statistics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 taskStatistics:
 *                   type: object
 *                   properties:
 *                     averageWorkTime:
 *                       type: number
 *                       description: The average work time for all tasks.
 *                     completionRate:
 *                       type: number
 *                       description: The average completion rate for all tasks.
 *                 totalUsers:
 *                   type: number
 *                   description: The total number of users in the system.
 *       500:
 *         description: Internal server error.
 */
app.post('/task-statistics', async (req, res) => {
  try {
    // Example: Calculate the average work time and completion rate for tasks
    const taskStats = await Task.aggregate([
      {
        $group: {
          _id: null, // Group all tasks together
          averageWorkTime: { $avg: "$work_time" },
          completionRate: { 
            $avg: { 
              $cond: [ "$completed", 1, 0 ] // 1 for completed tasks, 0 for others
            } 
          }
        }
      }
    ]);
    const totalUsers = await User.countDocuments();
    const stats = {
      taskStatistics: taskStats.length > 0 ? taskStats[0] : {},
      totalUsers
    };
    res.status(200).json(stats);
  } catch (error) {
    console.error('Failed to calculate task statistics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// server swagger documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(APIDocs));






/////////////TASK SERVICES///////////////////////
/**
 * @swagger
 * /task:
 *   post:
 *     summary: Create new task
 *     description: Allows authenticated users to create a new task.
 *     tags:
 *          - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *               date_added:
 *                 type: string
 *                 format: date-time
 *               desc:
 *                 type: string
 *               dropped:
 *                 type: boolean
 *               work_time:
 *                 type: number
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               due_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Task created successfully.
 *       500:
 *         description: Internal Server Error
 */
// Create new task
app.post('/task', authenticateToken, async (req, res) => {
  try {
      const { completed, date_added, desc, dropped, work_time, start_date, due_date } = req.body;

      // Create a new Task instance with the destructured fields
      const task = new Task({
          assigned_user: req.user.userId, // This should correctly reference the authenticated user's ID
          completed,
          date_added,
          desc,
          dropped,
          work_time,
          start_date,
          due_date
      });

      // Save the new Task to the database
      await task.save();
      // Increment the ongoing_tasks counter for the user
      await User.findByIdAndUpdate(req.user.userId, { $inc: { ongoing_tasks: 1 } })
      // Respond with the newly created Task
      res.status(201).json(task);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /task/drop/{taskId}:
 *   patch:
 *     summary: Drop a task
 *     description: Allows authenticated users to mark a task as dropped.
 *     tags:
 *          - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task dropped successfully.
 *       404:
 *         description: Task not found or unauthorized
 *       500:
 *         description: Internal Server Error
 */
// drop a task
app.patch('/task/drop/:taskId', authenticateToken, async (req, res) => {
  try {
      const updatedTask = await Task.findOneAndUpdate(
          { _id: req.params.taskId, assigned_user: req.user.userId },
          { dropped: true },
          { new: true }
      );
      if (!updatedTask) {
          return res.status(404).json({ error: 'Task not found or unauthorized' });
      }

      // Task was dropped successfully, now update the user's task counts
      await User.findByIdAndUpdate(req.user.userId, { 
          $inc: { ongoing_tasks: -1, dropped_tasks: 1 }
      });

      res.json(updatedTask);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /task/worktime/{taskId}:
 *   patch:
 *     summary: Add work time to a task
 *     description: Allows authenticated users to add additional work time to a task.
 *     tags:
 *          - Tasks  
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               additionalTime:
 *                 type: number
 *     responses:
 *       200:
 *         description: Work time added successfully.
 *       404:
 *         description: Task not found or unauthorized
 *       500:
 *         description: Internal Server Error
 */
// add work time 
app.patch('/task/worktime/:taskId', authenticateToken, async (req, res) => {
  try {
      const { additionalTime } = req.body;
      const task = await Task.findOne({ _id: req.params.taskId, assigned_user: req.user.userId });
      if (!task) {
          return res.status(404).json({ error: 'Task not found or unauthorized' });
      }
      task.work_time += additionalTime;
      await task.save();
      res.json(task);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /task/complete/{taskId}:
 *   patch:
 *     summary: Mark a task as complete
 *     description: Allows authenticated users to mark a task as complete.
 *     tags:
 *         - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task marked as complete successfully.
 *       404:
 *         description: Task not found or unauthorized
 *       500:
 *         description: Internal Server Error
 */
// mark as complete 
app.patch('/task/complete/:taskId', authenticateToken, async (req, res) => {
  try {
      const updatedTask = await Task.findOneAndUpdate(
          { _id: req.params.taskId, assigned_user: req.user.userId },
          { completed: true },
          { new: true }
      );
      if (!updatedTask) {
          return res.status(404).json({ error: 'Task not found or unauthorized' });
      }

      await User.findByIdAndUpdate(req.user.userId, { 
        $inc: { ongoing_tasks: -1, completed_tasks: 1 }
    });
      res.json(updatedTask);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /tasks/today:
 *   get:
 *     summary: Get tasks due today
 *     description: Retrieve all tasks assigned to the authenticated user that are due today.
 *     tags:
 *         - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully.
 *       500:
 *         description: Internal Server Error
 */
// Service to get tasks due today
app.get('/tasks/today', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // set to start of today in UTC
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1); // set to start of tomorrow in UTC

    const tasks = await Task.find({
      assigned_user: req.user.userId,
      completed: false,
      dropped: false,
      due_date: {
        $gte: today.toISOString(), // tasks due on or after the start of today
        $lt: tomorrow.toISOString(), // but before the start of tomorrow
      },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /tasks/nextweek:
 *   get:
 *     summary: Get tasks due next week
 *     description: Retrieve all tasks assigned to the authenticated user that are due within the next week.
 *     tags:
 *         - Tasks 
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully.
 *       500:
 *         description: Internal Server Error
 */
// Service to get tasks due one week from today
app.get('/tasks/nextweek', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // set to start of today in UTC
    const nextWeek = new Date(today);
    nextWeek.setUTCDate(today.getUTCDate() + 7); // set to exactly one week from now in UTC

    const tasks = await Task.find({
      assigned_user: req.user.userId,
      completed: false,
      dropped: false,
      due_date: {
        $gte: today.toISOString(), // tasks due on or after today
        $lt: nextWeek.toISOString(), // and before one week from now
      },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /register-email:
 *   post:
 *     summary: Send a welcome email to a new user
 *     description: Send a registration welcome email to the newly registered user's email address.
 *     tags:
 *          - Email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the newly registered user.
 *               username:
 *                 type: string
 *                 description: The username of the newly registered user.
 *     responses:
 *       200:
 *         description: Email sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Emails sent successfully
 *       500:
 *         description: Error occurred during email sending.
 */

app.post('/register-email', async(req,res) => {
  const options = {
    method: 'POST',
    url: 'https://mail-sender-api1.p.rapidapi.com/',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': EMAIL_API_KEY,
      'X-RapidAPI-Host': 'mail-sender-api1.p.rapidapi.com'
    },
    data: {
      sendto: req.body.email,
      name: 'FocusNook',
      replyTo: 'focusnook68@gmail.com',
      ishtml: 'false',
      title: 'Welcome to FocusNook',
      body: 'Hello ' + req.body.username + ', ' + 'we are thrilled to welcome you to FocusNook, your personalized productivity companion. FocusNook is designed to help you manage tasks, stay organized, and boost your productivity effortlessly if you have any questions please email focusnook68@gmail.com'
    }
  };
  
  try {
    console.log(options.data.sendto);
    const response = await axios.request(options);
    res.status(200).json({ message: 'Emails sent successfully' });
    console.log(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

});

  
// Listen on the configured port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

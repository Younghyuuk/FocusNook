const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Require the CORS module
const swaggerJSdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// this connects to mongoDB
require('./db');
const User = require('./User')

const app = express();
const port = 2000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000' // This will allow your frontend server to access the backend
}));

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
  apis: ['./express/app.js', './express/User.js'],
};

// initialize the swagger-jsdoc
const APIDocs = swaggerJSdoc(APIDocOptions);

// server swagger documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(APIDocs));

// Listen on the configured port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

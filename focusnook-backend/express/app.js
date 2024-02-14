// const express  = require('express');

// const app =  express();

// app.get('/', (req, res) => {
//     res.send("Welcome");
// });

// app.listen(3000, () =>{
//     console.log("listening to port 4000");
// });
const express = require('express');
const connectToMongoDB = require('../db');


const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectToMongoDB()
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit the app if the connection fails
  });

// Example route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Listen on the configured port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

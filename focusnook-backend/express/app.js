// const express  = require('express');

// const app =  express();

// app.get('/', (req, res) => {
//     res.send("Welcome");
// });

// app.listen(3000, () =>{
//     console.log("listening to port 4000");
// });
const express = require('express');
const connectToMongoDB = require('./db');


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

// Example route that doesnt work yet
app.get('/users', async (req, res) => {
  try {
    const db = await connectToMongoDB(); // Assuming this is your connection function
    const collection = db.collection('myCollection');
    const data = await collection.find({}).toArray(); // Fetches all documents
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});


// Listen on the configured port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

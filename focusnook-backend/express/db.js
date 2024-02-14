const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb+srv://aychon:focusnook123@focusnook.vkt1agp.mongodb.net/';
const client = new MongoClient(url);
// Database Name
const dbName = 'myProject';

// async function connect() {
//   try {
//     // Use connect method to connect to the server
//     await client.connect();
//     console.log('Connected successfully to MongoDB');
//     const db = client.db(dbName);
//     return db; // Return the database connection
//   } catch (error) {
//     console.error('Connection to MongoDB failed:', error);
//     process.exit(1);
//   }
// }
// db.js

async function connectToMongoDB() {
  const client = new MongoClient(url);
  await client.connect();
  console.log('Connected successfully to MongoDB');
  return client.db(dbName);
}

module.exports = connectToMongoDB;


// module.exports = connect;

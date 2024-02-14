const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb+srv://aychon:focusnook123@focusnook.vkt1agp.mongodb.net/';
const client = new MongoClient(url);
// Database Name
const dbName = 'myProject';

// connection to db
async function connectToMongoDB() {
  const client = new MongoClient(url);
  await client.connect();
  console.log('Connected successfully to MongoDB');
  return client.db(dbName);
}

module.exports = connectToMongoDB;


const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://aychon:focusnook123@focusnook.vkt1agp.mongodb.net/';

mongoose.connect(mongoURI, {
  // Remove useNewUrlParser and useUnifiedTopology options
  // useNewUrlParser: true, // No longer needed
  // useUnifiedTopology: true, // No longer needed
})
.then(() => console.log('Database connected!'))
.catch(err => console.log('Database connection error:', err));

module.exports = mongoose;


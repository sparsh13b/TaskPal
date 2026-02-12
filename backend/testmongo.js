const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('✅ MongoDB Atlas connected successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err);
    process.exit(1);
  });

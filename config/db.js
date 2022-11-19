require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
      await mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`, {
        // useFindAndModify: false,
        // useUnifiedTopology: true,
        // useNewUrlParser: true,
        // useCreateIndex: true,
      });
      console.log('MongoDB Connected!');
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  };
  
  module.exports = connectDB;




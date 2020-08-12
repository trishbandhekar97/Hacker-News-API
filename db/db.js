const mongoose = require('mongoose');
const redis = require('redis');
require('dotenv').config();

const password = encodeURIComponent(process.env.MONGO_ROOT_PASSWORD);

const connectionString = `mongodb://${process.env.MONGO_ROOT_USER}:${password}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}?authSource=admin`;

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log(`Connected to db ${connection.connection.host}`);
  } catch (err) {
    console.log(`Failed to Connect Reason: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

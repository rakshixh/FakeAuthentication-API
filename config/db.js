const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `MongoDB Connection Connected: ${conn.connection.host}`.cyan.underline
    );
    isConnected = true;
  } catch (error) {
    console.error(`Error connecting to database: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  if (!isConnected) {
    console.log("Not connected to the database");
    return;
  }

  try {
    await mongoose.disconnect();
    console.log("MongoDB Connection Disconnected".cyan.underline);
    isConnected = false;
  } catch (error) {
    console.error(`Error disconnecting from database: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB, disconnectDB };

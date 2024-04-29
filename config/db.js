const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("[ Already connected to the database! ]".magenta.bold);
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `\n \n[ Application connected to MongoDB Database ]`.magenta.bold
    );
    isConnected = true;
  } catch (error) {
    console.error(
      `Error connecting to database: ${error.message}`.red.italic.underline
    );
    process.exit(1);
  }
};

const disconnectDB = async () => {
  if (!isConnected) {
    console.log("[ Not connected to the database! ]".red.bold);
    return;
  }

  try {
    await mongoose.disconnect();
    console.log(
      "\n \n[ Application disconnected from MongoDB Database ]".red.bold
    );
    isConnected = false;
  } catch (error) {
    console.error(
      `Error disconnecting from database: ${error.message}`.red.italic.underline
    );
    process.exit(1);
  }
};

module.exports = { connectDB, disconnectDB };

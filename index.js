const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const favicon = require("serve-favicon");
const path = require("path");
const colors = require("colors");
const dotenv = require("dotenv").config();
const cron = require("node-cron");
const { connectDB, disconnectDB } = require("./config/db");

const swaggerUi = require("swagger-ui-express");
const swagger = require("./utilities/swagger");

// create our express app
const app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors());

// Serve favicon
app.use(favicon(path.join(__dirname, "favicon.ico")));

// Function to make a connection to database and disconnect
const OpenAndCloseConnection = async () => {
  try {
    await connectDB();
    console.log("--------------------------------------------");
    console.log("28 DAYS OVER!");
    console.log(
      "Making connection to the database to keep the cluster running!"
    );
    console.log("-------------------------------------------- \n \n");
    setTimeout(async () => {
      await disconnectDB();
      console.log("--------------------------------------------");
      console.log("20 Seconds Over!");
      console.log("Disconnecting the connection from the database!");
      console.log("-------------------------------------------- \n \n");
    }, 20000); // Disconnect after 20 seconds
  } catch (error) {
    console.error("Error:", error);
  }
};

// Schedule the function to run every 28 days
cron.schedule(
  "0 0 1 * *",
  async () => {
    // Runs at midnight on the 1st of every month
    await OpenAndCloseConnection();
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

// route
app.get("/", (req, res) => {
  res.send("Welcome to the Fake Authentication API!");
});

const routes = require("./Routes/Routes");
app.use("/api", routes);

//Swagger serve route
app.use("/api/api-docs", swaggerUi.serve, swagger);

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Fake Authentication API server is running on port: ${PORT}`);
});

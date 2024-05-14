const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const favicon = require("serve-favicon");
const path = require("path");
const colors = require("colors");
const dotenv = require("dotenv").config();
const cron = require("node-cron");
const axios = require("axios");
const { connectDB, disconnectDB } = require("./config/db");
const { swaggerServe, swaggerSetup } = require("./config/swaggerConfig");

// Define base URLs for both localhost and hosted server
const PORT = process.env.PORT || 5000;

// create our express app
const app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors());

// Serve favicon
app.use(favicon(path.join(__dirname, "assets", "favicon.ico")));

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

// Schedule a job to make a request to the server every 5 minutes
const KeepActivityConnection =
  "https://fakeauthentication-api.onrender.com/api";
cron.schedule(
  "*/9 * * * *",
  async () => {
    try {
      // Make a request to the root endpoint to keep the server active
      const response = await axios.get(`${KeepActivityConnection}`);
      console.log(
        `\nRequest to server made to keep it active. \nResponse:${response.data}\n`
      );
    } catch (error) {
      console.error("Error making request:", error.message);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

// Route to serve the website
app.use(express.static(path.join(__dirname, "website")));

// route to api
app.get("/api", (req, res) => {
  res.send("Welcome to the Fake Authentication API!");
});

const routes = require("./Routes/Routes");
app.use("/api", routes);

//Swagger serve route
app.use("/api/api-docs", swaggerServe, swaggerSetup);

// start the server
app.listen(PORT, () => {
  console.log(`Fake Authentication API server is running on port: ${PORT}`);
});

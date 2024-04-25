const express = require("express");
const apiRoutes = express.Router();

// Import JSON data from Data.js initially
let jsonData = require("./AuthData");

// Function to update jsonData with fresh data from Data.js
const updateData = () => {
  try {
    delete require.cache[require.resolve("./AuthData")]; // Clear cache to force re-import
    jsonData = require("./AuthData");
    console.log("Data updated at: ", new Date());
  } catch (error) {
    console.error("Error updating data:", error);
  }
};

// Call updateData initially and then every 60 minutes
updateData(); // Initial update
const interval = setInterval(updateData, 60 * 60 * 1000);

// Route to get all users
apiRoutes.get("/allusers", (req, res) => {
  try {
    const allUsers = [].concat(
      jsonData.guests,
      jsonData.users,
      jsonData.admins
    );
    const response = {
      statusCode: 200,
      status: true,
      message: "All users fetched successfully",
      allUsers: allUsers,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(200).json({
      statusCode: 500,
      status: false,
      message: "Internal server error",
    });
  }
});

// Route to get only Guest Users
apiRoutes.get("/guests", (req, res) => {
  try {
    const response = {
      statusCode: 200,
      status: true,
      message: "All guest users fetched successfully",
      guests: jsonData.guests,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(200).json({
      statusCode: 500,
      status: false,
      message: "Internal server error",
    });
  }
});

// Route to get only normal Users
apiRoutes.get("/users", (req, res) => {
  try {
    const response = {
      statusCode: 200,
      status: true,
      message: "All normal users fetched successfully",
      normalUsers: jsonData.users,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(200).json({
      statusCode: 500,
      status: false,
      message: "Internal server error",
    });
  }
});

// Route to get only Admin Users
apiRoutes.get("/admins", (req, res) => {
  try {
    const response = {
      statusCode: 200,
      status: true,
      message: "All admin users fetched successfully",
      admins: jsonData.admins,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(200).json({
      statusCode: 500,
      status: false,
      message: "Internal server error",
    });
  }
});
module.exports = apiRoutes;

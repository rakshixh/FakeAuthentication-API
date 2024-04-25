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

// Route to login the users
apiRoutes.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    // Find the user
    let user = jsonData.guests.find((user) => user.username === username);
    if (!user) {
      user = jsonData.users.find((user) => user.username === username);
      if (!user) {
        user = jsonData.admins.find((user) => user.username === username);
      }
    }

    if (!user || user.password !== password) {
      res.status(200).json({
        statusCode: 401,
        status: false,
        message: "Invalid username or password",
      });
      return;
    }

    // User found and password matched
    res.status(200).json({
      statusCode: 200,
      status: true,
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(200).json({
      statusCode: 500,
      status: false,
      message: "Internal server error",
    });
  }
});

module.exports = apiRoutes;

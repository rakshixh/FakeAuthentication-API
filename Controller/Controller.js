const express = require("express");
const apiRoutes = express.Router();
const User = require("../models/staticUsers");
const { connectDB, disconnectDB } = require("../config/db");

// Route to get all users data
apiRoutes.get("/allusers", async (req, res) => {
  await connectDB();
  try {
    const allUsers = await User.find();
    const response = {
      statusCode: 200,
      status: true,
      message: "All users fetched successfully",
      allUsers: allUsers,
    };
    res.status(200).json(response);
    disconnectDB();
  } catch (error) {
    res.status(200).json({
      statusCode: 500,
      status: false,
      message: "Internal server error",
    });
  }
});

// Route to get only Guest Users
apiRoutes.get("/guests", async (req, res) => {
  await connectDB();
  try {
    const guests = await User.find({ role: "guest" });
    const response = {
      statusCode: 200,
      status: true,
      message: "All guest users fetched successfully",
      guests: guests,
    };
    res.status(200).json(response);
    disconnectDB();
  } catch (error) {
    res.status(200).json({
      statusCode: 500,
      status: false,
      message: "Internal server error",
    });
  }
});

// Route to get only Admins Users
apiRoutes.get("/admins", async (req, res) => {
  await connectDB();
  try {
    const admins = await User.find({ role: "admin" });
    const response = {
      statusCode: 200,
      status: true,
      message: "All admin users fetched successfully",
      guests: admins,
    };
    res.status(200).json(response);
    disconnectDB();
  } catch (error) {
    res.status(200).json({
      statusCode: 500,
      status: false,
      message: "Internal server error",
    });
  }
});

// Route to get only Normal Users
apiRoutes.get("/users", async (req, res) => {
  await connectDB();
  try {
    const users = await User.find({ role: "user" });
    const response = {
      statusCode: 200,
      status: true,
      message: "All normal users fetched successfully",
      guests: users,
    };
    res.status(200).json(response);
    disconnectDB();
  } catch (error) {
    res.status(200).json({
      statusCode: 500,
      status: false,
      message: "Internal server error",
    });
  }
});

// Route to login the users
apiRoutes.post("/login", async (req, res) => {
  await connectDB();
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    // If user not found or password doesn't match, send error response
    if (!user || user.password !== password) {
      return res.status(200).json({
        statusCode: 401,
        status: false,
        message: "Invalid username or password",
      });
    }

    // User found and password matched, send success response
    res.status(200).json({
      statusCode: 200,
      status: true,
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        address: user.address,
      },
    });
    disconnectDB();
  } catch (error) {
    res.status(200).json({
      statusCode: 500,
      status: false,
      message: "Internal server error",
    });
  }
});

module.exports = apiRoutes;

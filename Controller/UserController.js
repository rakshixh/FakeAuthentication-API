const express = require("express");
const userRoutes = express.Router();
const User = require("../models/staticUsers");
const { connectDB, disconnectDB } = require("../config/db");

// @desc These are Static APIs with only GET requests
// ----------------------------------------------------------------

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /api/staticUsers/allusers:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Retrieve all users from the database
 *     responses:
 *       '200':
 *         description: A JSON array of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: All users fetched successfully
 *                 allUsers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       '500':
 *         description: Internal server error
 */

// Route to get all users data
userRoutes.get("/allusers", async (req, res) => {
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

/**
 * @swagger
 * /api/guests:
 *   get:
 *     summary: Get all guest users
 *     tags: [Users]
 *     description: Retrieve all guest users from the database
 *     responses:
 *       '200':
 *         description: A JSON array of all guest users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: All guest users fetched successfully
 *                 guests:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       '500':
 *         description: Internal server error
 */

// Route to get only Guest Users
userRoutes.get("/guests", async (req, res) => {
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

/**
 * @swagger
 * /api/admins:
 *   get:
 *     summary: Get all admin users
 *     tags: [Users]
 *     description: Retrieve all admin users from the database
 *     responses:
 *       '200':
 *         description: A JSON array of all admin users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: All admin users fetched successfully
 *                 admins:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       '500':
 *         description: Internal server error
 */

// Route to get only Admins Users
userRoutes.get("/admins", async (req, res) => {
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

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all normal users
 *     tags: [Users]
 *     description: Retrieve all normal users from the database
 *     responses:
 *       '200':
 *         description: A JSON array of all normal users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: All normal users fetched successfully
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       '500':
 *         description: Internal server error
 */

// Route to get only Normal Users
userRoutes.get("/users", async (req, res) => {
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

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Log in user
 *     tags: [Users]
 *     description: Log in the user with username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '401':
 *         description: Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid username or password
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

// Route to login the users
userRoutes.post("/login", async (req, res) => {
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

module.exports = userRoutes;

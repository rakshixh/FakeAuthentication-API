const express = require("express");
const userRoutes = express.Router();
const User = require("../models/staticUsers");
const { connectDB, disconnectDB } = require("../config/db");

// @desc These are Static APIs with only GET requests
// ----------------------------------------------------------------

/**
 * @swagger
 * tags:
 *   name: Static Users
 *   description: These APIs are for fast access to static data with GET and POST requests!
 */

/**
 * @swagger
 * /api/staticUsers/allusers:
 *   get:
 *     summary: Get all static users
 *     tags: [Static Users]
 *     description: Retrieve all static users from the database
 *     responses:
 *       '200':
 *         description: An object with a JSON array of all users
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
 * /api/staticUsers/guests:
 *   get:
 *     summary: Get all static guest users
 *     tags: [Static Users]
 *     description: Retrieve all static guest users from the database
 *     responses:
 *       '200':
 *         description: An object with a JSON array of all guest users
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
 * /api/staticUsers/admins:
 *   get:
 *     summary: Get all static admin users
 *     tags: [Static Users]
 *     description: Retrieve all static admin users from the database
 *     responses:
 *       '200':
 *         description: An object with a JSON array of all admin users
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

// Route to get only Admins Users
userRoutes.get("/admins", async (req, res) => {
  await connectDB();
  try {
    const admins = await User.find({ role: "admin" });
    const response = {
      statusCode: 200,
      status: true,
      message: "All admin users fetched successfully",
      admins: admins,
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
 * /api/staticUsers/users:
 *   get:
 *     summary: Get all static normal users
 *     tags: [Static Users]
 *     description: Retrieve all static normal users from the database
 *     responses:
 *       '200':
 *         description: An object with a JSON array of all normal users
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

// Route to get only Normal Users
userRoutes.get("/users", async (req, res) => {
  await connectDB();
  try {
    const users = await User.find({ role: "user" });
    const response = {
      statusCode: 200,
      status: true,
      message: "All normal users fetched successfully",
      users: users,
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
 * /api/staticUsers/login:
 *   post:
 *     summary: Log in API for static users
 *     tags: [Static Users]
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
 *                 example: michael_johnson
 *               password:
 *                 type: string
 *                 example: Michael123!
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
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: michael_johnson
 *                     email:
 *                       type: string
 *                       example: michael@gmail.com
 *                     name:
 *                       type: string
 *                       example: Michael Johnson
 *                     role:
 *                       type: string
 *                       example: user
 *                     address:
 *                       type: object
 *                       properties:
 *                         street:
 *                           type: string
 *                           example: 123 Main St
 *                         city:
 *                           type: string
 *                           example: New York City
 *                         state:
 *                           type: string
 *                           example: New York
 *                         zipcode:
 *                           type: string
 *                           example: 10001
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

const express = require("express");
const SAUsersDataRoutes = express.Router();
const SuperAdmin = require("../models/dynamicUsers");
const DynamicUsersData = require("../models/dynamicUsersData");
const { connectDB, disconnectDB } = require("../config/db");
const { getCurrentDateTimeIndia } = require("../utilities/CurrentDate");

// @desc These are Dynamic APIs with only GET, POST, PUT, DELETE requests
// ----------------------------------------------------------------------

/**
 * @swagger
 * tags:
 *   name: Dynamic Users - Super Admin's Users
 *   description: APIs related to Dynamic Users
 */

/**
 * @swagger
 * /api/dynamicUsers/create/superadmin/{SuperAdminUserName}:
 *   post:
 *     summary: Create a user account under a Super Admin account
 *     tags: [Dynamic Users - Super Admin's Users]
 *     parameters:
 *       - in: path
 *         name: SuperAdminUserName
 *         required: true
 *         description: Username of the Super Admin account under which the user account will be created
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               otherProperties:
 *                 type: object
 *     responses:
 *       '200':
 *         description: User account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/SuperAdmin'
 *       '400':
 *         description: Invalid username format, Username or email already exists, or Maximum number of users reached
 *       '404':
 *         description: Super Admin account not found
 *       '500':
 *         description: Internal server error
 */

// Route to Create a multiple User Accounts under a Super Admin Account
SAUsersDataRoutes.post(
  "/create/superadmin/:SuperAdminUserName",
  async (req, res) => {
    await connectDB();
    try {
      const { SuperAdminUserName } = req.params;
      const superAdmin = await SuperAdmin.findOne({ SuperAdminUserName });

      if (!superAdmin) {
        disconnectDB();
        return res.status(200).json({
          statusCode: 404,
          status: false,
          message: "Super Admin account not found",
        });
      }

      // Extract username and email from the request body
      const { username, email, ...userData } = req.body;

      // Validate username format
      if (!/^[a-z0-9_.]+$/.test(username)) {
        disconnectDB();
        return res.status(200).json({
          statusCode: 400,
          status: false,
          message:
            "Username can only contain lowercase letters, numbers, underscores, and dots",
        });
      }

      // Check if username is already taken
      const existingUser = await DynamicUsersData.findOne({ username });
      if (existingUser) {
        disconnectDB();
        return res.status(200).json({
          statusCode: 400,
          status: false,
          message: "Username is already taken",
        });
      }

      // Check if email is already registered
      const existingEmail = await DynamicUsersData.findOne({ email });
      if (existingEmail) {
        disconnectDB();
        return res.status(200).json({
          statusCode: 400,
          status: false,
          message: "Email is already registered",
        });
      }

      // Check the count of existing users under this super admin
      const userCount = await DynamicUsersData.countDocuments({
        SuperAdminUserName,
      });
      if (userCount >= 15) {
        disconnectDB();
        return res.status(400).json({
          statusCode: 400,
          status: false,
          message: "Maximum number of users reached for this Super Admin",
        });
      }

      // All validations passed, proceed to create the user
      const userDataWithSuperAdmin = {
        ...userData,
        username,
        email,
        SuperAdminUserName,
      };
      const createUser = await DynamicUsersData.create(userDataWithSuperAdmin);
      await SuperAdmin.findOneAndUpdate(
        { SuperAdminUserName },
        { lastAccessed: getCurrentDateTimeIndia() }
      );

      res.status(200).json({
        statusCode: 200,
        status: true,
        message: `${SuperAdminUserName} created a new user account successfully`,
        user: createUser,
      });
      disconnectDB();
    } catch (error) {
      res.status(200).json({
        statusCode: 500,
        status: false,
        message: "Internal server error",
      });
    }
  }
);

/**
 * @swagger
 * /api/dynamicUsers/get/superadmin/users/{SuperAdminUserName}:
 *   get:
 *     summary: Get all user accounts under a Super Admin account
 *     tags: [Dynamic Users - Super Admin's Users]
 *     parameters:
 *       - in: path
 *         name: SuperAdminUserName
 *         required: true
 *         description: Username of the Super Admin account to get users from
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Users found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SuperAdmin'
 *       '404':
 *         description: Super Admin account not found
 *       '500':
 *         description: Internal server error
 */

//Route to GET all the User Accounts under a Super Admin Account
SAUsersDataRoutes.get(
  "/get/superadmin/users/:SuperAdminUserName",
  async (req, res) => {
    await connectDB();
    try {
      const { SuperAdminUserName } = req.params;
      const superAdmin = await SuperAdmin.findOne({ SuperAdminUserName });

      if (!superAdmin) {
        disconnectDB();
        return res.status(200).json({
          statusCode: 404,
          status: false,
          message: "Super Admin account not found",
        });
      }

      const users = await DynamicUsersData.find({ SuperAdminUserName });
      res.status(200).json({
        statusCode: 200,
        status: true,
        users: users,
      });
      disconnectDB();
    } catch (error) {
      res.status(200).json({
        statusCode: 500,
        status: false,
        message: "Internal server error",
      });
    }
  }
);

// Route to Update the Name, address and the role of the user created by the Super Admin
SAUsersDataRoutes.put(
  "/update/user/:SuperAdminUserName/:username",
  async (req, res) => {
    await connectDB();
    try {
      const { SuperAdminUserName, username } = req.params;
      const { name, email, address, role } = req.body;

      // Check if the user exists and was created by the specified Super Admin
      const user = await DynamicUsersData.findOne({
        username,
        SuperAdminUserName,
      });
      if (!user) {
        disconnectDB();
        return res.status(200).json({
          statusCode: 404,
          status: false,
          message: "User not found or not created by the specified Super Admin",
        });
      }

      // Update user data
      if (name) user.name = name;
      if (email) user.email = email;
      if (address) user.address = address; //address is an object with other properties
      if (role) user.role = role;

      // Save the updated user
      await user.save();
      await SuperAdmin.findOneAndUpdate(
        { SuperAdminUserName },
        { lastAccessed: getCurrentDateTimeIndia() }
      );

      res.status(200).json({
        statusCode: 200,
        status: true,
        message: "User data updated successfully",
        user: user,
      });
      disconnectDB();
    } catch (error) {
      res.status(200).json({
        statusCode: 500,
        status: false,
        message: "Internal server error",
      });
    }
  }
);

//Route to update the password of the user created by the super admin
SAUsersDataRoutes.put(
  "/update/password/:SuperAdminUserName/:username",
  async (req, res) => {
    await connectDB();
    try {
      const { SuperAdminUserName, username } = req.params;
      const { password, rePassword, currentPassword } = req.body;

      // Check if the user exists and was created by the specified Super Admin
      const user = await DynamicUsersData.findOne({
        username,
        SuperAdminUserName,
      });
      if (!user) {
        disconnectDB();
        return res.status(200).json({
          statusCode: 404,
          status: false,
          message: "User not found or not created by the specified Super Admin",
        });
      }

      // Verify current password
      if (user.password !== currentPassword) {
        disconnectDB();
        return res.status(200).json({
          statusCode: 400,
          status: false,
          message: "Current password is incorrect",
        });
      }

      // Check if the new password and confirm password match
      if (password !== rePassword) {
        disconnectDB();
        return res.status(200).json({
          statusCode: 400,
          status: false,
          message: "Passwords do not match",
        });
      }

      // Check if the new password is the same as the current password
      if (password === currentPassword) {
        disconnectDB();
        return res.status(200).json({
          statusCode: 400,
          status: false,
          message: "New password must be different from the current password",
        });
      }

      // Update user password
      user.password = password;

      // Save the updated user
      await user.save();
      await SuperAdmin.findOneAndUpdate(
        { SuperAdminUserName },
        { lastAccessed: getCurrentDateTimeIndia() }
      );

      res.status(200).json({
        statusCode: 200,
        status: true,
        message: "User password updated successfully",
        user: user,
      });
      disconnectDB();
    } catch (error) {
      res.status(200).json({
        statusCode: 500,
        status: false,
        message: "Internal server error",
      });
    }
  }
);

// Route to DELETE the user created by the Super Admin
SAUsersDataRoutes.delete(
  "/delete/user/:SuperAdminUserName/:username",
  async (req, res) => {
    await connectDB();
    try {
      const { SuperAdminUserName, username } = req.params;

      // Check if the user exists and was created by the specified Super Admin
      const user = await DynamicUsersData.findOne({
        username,
        SuperAdminUserName,
      });
      if (!user) {
        disconnectDB();
        return res.status(200).json({
          statusCode: 404,
          status: false,
          message: "User not found or not created by the specified Super Admin",
        });
      }

      // Delete the user
      await DynamicUsersData.findOneAndDelete({
        username,
        SuperAdminUserName,
      });
      await SuperAdmin.findOneAndUpdate(
        { SuperAdminUserName },
        { lastAccessed: getCurrentDateTimeIndia() }
      );

      res.status(200).json({
        statusCode: 200,
        status: true,
        message: "User deleted successfully",
      });
      disconnectDB();
    } catch (error) {
      res.status(200).json({
        statusCode: 500,
        status: false,
        message: "Internal server error",
      });
    }
  }
);

module.exports = SAUsersDataRoutes;

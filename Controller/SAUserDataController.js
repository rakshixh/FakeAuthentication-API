const express = require("express");
const SAUsersDataRoutes = express.Router();
const SuperAdmin = require("../models/dynamicUsers");
const DynamicUsersData = require("../models/dynamicUsersData");
const { connectDB, disconnectDB } = require("../config/db");
const { getCurrentDateTime } = require("../utilities/CurrentDate");

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
 * /api/dynamicUsers/superAdmin/register/users/{SuperAdminUserName}:
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
 *           example: superadmin
 *     requestBody:
 *       required: true
 *       description: Please include all the properties given below in request body to create the user under the super admin.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: user1
 *               password:
 *                 type: string
 *                 example: userpass@1!
 *               email:
 *                 type: string
 *                 example: user1@gmail.com
 *               role:
 *                 type: string
 *                 example: guest
 *               name:
 *                 type: string
 *                 example: User One
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: 123 Main St
 *                   city:
 *                     type: string
 *                     example: New York
 *                   state:
 *                     type: string
 *                     example: NY
 *                   zipcode:
 *                     type: string
 *                     example: 10001
 *     responses:
 *       '200':
 *         description: superadmin created a new user account successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: superadmin created a new user account successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: user1
 *                     password:
 *                       type: string
 *                       example: userpass@1!
 *                     email:
 *                       type: string
 *                       example: user1@gmail.com
 *                     role:
 *                       type: string
 *                       example: guest
 *                     name:
 *                       type: string
 *                       example: User One
 *                     address:
 *                       type: object
 *                       properties:
 *                         street:
 *                           type: string
 *                           example: 123 Main St
 *                         city:
 *                           type: string
 *                           example: New York
 *                         state:
 *                           type: string
 *                           example: NY
 *                         zipcode:
 *                           type: string
 *                           example: 10001
 *                     SuperAdminUserName:
 *                       type: string
 *                       example: superadmin
 *                     _id:
 *                       type: string
 *                       example: 663b19bf4c0f18213033aeb8
 *                     __v:
 *                       type: number
 *                       example: 0
 *       '400':
 *         description: Invalid username format OR Username or email already exists OR Maximum number of users reached
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid username format, Username or email already exists, or Maximum number of users reached
 *       '404':
 *         description: Super Admin account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 404
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Super Admin account not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

// Route to Create a multiple User Accounts under a Super Admin Account
SAUsersDataRoutes.post(
  "/superAdmin/register/users/:SuperAdminUserName",
  async (req, res) => {
    await connectDB();
    try {
      const { SuperAdminUserName } = req.params;
      const superAdmin = await SuperAdmin.findOne({ SuperAdminUserName });

      if (!superAdmin) {
        return res.status(404).json({
          statusCode: 404,
          status: false,
          message: "Super Admin account not found",
        });
      }

      // Extract username and email from the request body
      const { username, email, ...userData } = req.body;

      // Validate username format
      if (!/^[a-z0-9_.]+$/.test(username)) {
        return res.status(400).json({
          statusCode: 400,
          status: false,
          message:
            "Username can only contain lowercase letters, numbers, underscores, and dots",
        });
      }

      // Check if username is already taken under the same SuperAdmin
      const existingUser = await DynamicUsersData.findOne({
        username,
        SuperAdminUserName,
      });
      if (existingUser) {
        return res.status(400).json({
          statusCode: 400,
          status: false,
          message: "Username is already taken",
        });
      }

      // Check if email is already registered under the same SuperAdmin
      const existingEmail = await DynamicUsersData.findOne({
        email,
        SuperAdminUserName,
      });
      if (existingEmail) {
        return res.status(400).json({
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
        { lastAccessed: getCurrentDateTime() }
      );

      res.status(200).json({
        statusCode: 200,
        status: true,
        message: `${SuperAdminUserName} created a new user account successfully`,
        user: createUser,
      });
    } catch (error) {
      console.error("Error during user registration:", error); // Log the error for debugging
      res.status(500).json({
        statusCode: 500,
        status: false,
        message: "Internal server error",
      });
    } finally {
      disconnectDB();
    }
  }
);

/**
 * @swagger
 * /api/dynamicUsers/superAdmin/get/users/{SuperAdminUserName}:
 *   get:
 *     summary: Get all users under a Super Admin account
 *     tags: [Dynamic Users - Super Admin's Users]
 *     parameters:
 *       - in: path
 *         name: SuperAdminUserName
 *         required: true
 *         description: Username of the Super Admin account to get users from
 *         schema:
 *           type: string
 *           example: superadmin
 *     responses:
 *       '200':
 *         description: All User accounts under the Super Admin retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                  type: string
 *                  example: All User accounts under the Super Admin retrieved successfully
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       address:
 *                         type: object
 *                         properties:
 *                           street:
 *                             type: string
 *                           city:
 *                             type: string
 *                           state:
 *                             type: string
 *                           zipcode:
 *                             type: string
 *                       _id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       password:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       name:
 *                         type: string
 *                       SuperAdminUserName:
 *                         type: string
 *                       __v:
 *                         type: number
 *                         example: 0
 *       '404':
 *         description: Super Admin account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 404
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Super Admin account not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

//Route to GET all the User Accounts under a Super Admin Account
SAUsersDataRoutes.get(
  "/superAdmin/get/users/:SuperAdminUserName",
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
        message:
          "All User accounts under the Super Admin retrieved successfully",
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

/**
 * @swagger
 * /api/dynamicUsers/superAdmin/update/users/{SuperAdminUserName}/{username}:
 *   put:
 *     summary: Update specific user data created by the Super Admin
 *     tags: [Dynamic Users - Super Admin's Users]
 *     parameters:
 *       - in: path
 *         name: SuperAdminUserName
 *         required: true
 *         description: Username of the Super Admin who created the user
 *         schema:
 *           type: string
 *           example: superadmin
 *       - in: path
 *         name: username
 *         required: true
 *         description: Username of the user to update
 *         schema:
 *           type: string
 *           example: user1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated User
 *               email:
 *                 type: string
 *                 example: updateduser@gmail.com
 *               role:
 *                 type: string
 *                 example: Updated Role
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: Updated 456 Second St
 *                   city:
 *                     type: string
 *                     example: Updated Los Angeles
 *                   state:
 *                     type: string
 *                     example: Updated CA
 *                   zipcode:
 *                     type: string
 *                     example: 90001
 *     responses:
 *       '200':
 *         description: Specific User data of a specific Super Admin updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Specific User data of a specific Super Admin updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: object
 *                       properties:
 *                         street:
 *                           type: string
 *                           example: Updated 456 Second St
 *                         city:
 *                           type: string
 *                           example: Updated Los Angeles
 *                         state:
 *                           type: string
 *                           example: Updated CA
 *                         zipcode:
 *                           type: string
 *                           example: 90001
 *                     _id:
 *                       type: string
 *                       example: 663b19bf4c0f18213033aeb8
 *                     username:
 *                       type: string
 *                       example: user1
 *                     password:
 *                       type: string
 *                       example: userpass@1!
 *                     email:
 *                       type: string
 *                       example: updateduser@gmail.com
 *                     role:
 *                       type: string
 *                       example: Updated Role
 *                     name:
 *                       type: string
 *                       example: Updated User
 *                     SuperAdminUserName:
 *                       type: string
 *                       example: superadmin
 *                     __v:
 *                       type: number
 *                       example: 0

 *       '404':
 *         description: User not found or not created by the specified Super Admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 404
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found or not created by the specified Super Admin
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

// Route to Update the Name, address and the role of the user created by the Super Admin
SAUsersDataRoutes.put(
  "/superAdmin/update/users/:SuperAdminUserName/:username",
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
        { lastAccessed: getCurrentDateTime() }
      );

      res.status(200).json({
        statusCode: 200,
        status: true,
        message:
          "Specific User data of a specific Super Admin updated successfully",
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

/**
 * @swagger
 * /api/dynamicUsers/superAdmin/update/password/users/{SuperAdminUserName}/{username}:
 *   put:
 *     summary: Update the password of a specific user created by a specific Super Admin
 *     tags: [Dynamic Users - Super Admin's Users]
 *     parameters:
 *       - in: path
 *         name: SuperAdminUserName
 *         required: true
 *         description: Username of the Super Admin who created the user
 *         schema:
 *           type: string
 *           example: superadmin
 *       - in: path
 *         name: username
 *         required: true
 *         description: Username of the user whose password needs to be updated
 *         schema:
 *           type: string
 *           example: user1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: Type the new password
 *               rePassword:
 *                 type: string
 *                 example: Retype the new password
 *               currentPassword:
 *                 type: string
 *                 example: Type the current password
 *     responses:
 *       '200':
 *         description: Specified User's password of a specified Super Admin updated successfully
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
 *                   example: Specified User's password of a specified Super Admin updated successfully
 *       '400':
 *         description: Current password incorrect, Passwords do not match, or New password must be different from the current password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Current password incorrect, Passwords do not match, or New password must be different from the current password
 *       '404':
 *         description: User not found or not created by the specified Super Admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found or not created by the specified Super Admin
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

//Route to update the password of the user created by the super admin
SAUsersDataRoutes.put(
  "/superAdmin/update/password/users/:SuperAdminUserName/:username",
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
        { lastAccessed: getCurrentDateTime() }
      );

      res.status(200).json({
        statusCode: 200,
        status: true,
        message:
          "Specified User's password of a specified Super Admin updated successfully",
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
 * /api/dynamicUsers/superAdmin/delete/users/{SuperAdminUserName}/{username}:
 *   delete:
 *     summary: Delete a specified user created by a specified Super Admin
 *     tags: [Dynamic Users - Super Admin's Users]
 *     parameters:
 *       - in: path
 *         name: SuperAdminUserName
 *         required: true
 *         description: Username of the Super Admin who created the user
 *         schema:
 *           type: string
 *           example: superadmin
 *       - in: path
 *         name: username
 *         required: true
 *         description: Username of the user to be deleted
 *         schema:
 *           type: string
 *           example: user1
 *     responses:
 *       '200':
 *         description: Specified User of a specified Super Admin deleted successfully
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
 *                   example: Specified User of a specified Super Admin deleted successfully
 *       '404':
 *         description: User not found or not created by the specified Super Admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found or not created by the specified Super Admin
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

// Route to DELETE the user created by the Super Admin
SAUsersDataRoutes.delete(
  "/superAdmin/delete/users/:SuperAdminUserName/:username",
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
        message:
          "Specified User of a specified Super Admin deleted successfully",
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
 * /api/dynamicUsers/superAdmin/login/users/{SuperAdminUserName}:
 *   post:
 *     summary: Login user created by the Super Admin
 *     tags: [Dynamic Users - Super Admin's Users]
 *     parameters:
 *       - in: path
 *         name: SuperAdminUserName
 *         required: true
 *         description: Username of the Super Admin who created the user
 *         schema:
 *           type: string
 *           example: superadmin
 *     requestBody:
 *       required: true
 *       description: Please include all the properties given below in request body to login the user created under the super admin.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the user who needs to login
 *                 example: user1
 *               password:
 *                 type: string
 *                 description: User's password who needs to login
 *                 example: userpass@1!
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User logged in successfully!
 *                 user:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: object
 *                       properties:
 *                         street:
 *                           type: string
 *                           example: 456 Second St
 *                         city:
 *                           type: string
 *                           example: Los Angeles
 *                         state:
 *                           type: string
 *                           example: CA
 *                         zipcode:
 *                           type: string
 *                           example: 90001
 *                     _id:
 *                       type: string
 *                       example: 663b19bf4c0f18213033aeb8
 *                     username:
 *                       type: string
 *                       example: user1
 *                     password:
 *                       type: string
 *                       example: userpass@1!
 *                     email:
 *                       type: string
 *                       example: user1@gmail.com
 *                     role:
 *                       type: string
 *                       example: guest
 *                     name:
 *                       type: string
 *                       example: User One
 *                     SuperAdminUserName:
 *                       type: string
 *                       example: superadmin
 *                     __v:
 *                       type: number
 *                       example: 0
 *       '404':
 *         description: User not found or not created by the specified Super Admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 404
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found or not created by the specified Super Admin
 *       '401':
 *         description: Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
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
 *                   type: number
 *                   example: 500
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

// Route to login the specific user created by the Super Admin
SAUsersDataRoutes.post(
  "/superAdmin/login/users/:SuperAdminUserName",
  async (req, res) => {
    await connectDB();
    try {
      const { SuperAdminUserName } = req.params;
      const { username, password } = req.body;

      // Check if the user exists and was created by the specified Super Admin
      const user = await DynamicUsersData.findOne({
        username,
        SuperAdminUserName,
      });

      // If user not found, send error response
      if (!user) {
        disconnectDB();
        return res.status(200).json({
          statusCode: 404,
          status: false,
          message: "User not found or not created by the specified Super Admin",
        });
      }

      // If password doesn't match, send error response
      if (user.password !== password) {
        disconnectDB();
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
        message: "User logged in successfully!",
        user: user,
      });
      disconnectDB();
    } catch (error) {
      disconnectDB();
      res.status(200).json({
        statusCode: 500,
        status: false,
        message: "Internal server error",
      });
    }
  }
);

module.exports = SAUsersDataRoutes;

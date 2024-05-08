const express = require("express");
const cron = require("node-cron");
const colors = require("colors");
const superAdminRoutes = express.Router();
const SuperAdmin = require("../models/dynamicUsers");
const DynamicUsersData = require("../models/dynamicUsersData");
const { connectDB, disconnectDB } = require("../config/db");
const { getCurrentDateTimeIndia } = require("../utilities/CurrentDate");

// @desc These are Dynamic APIs with only GET, POST, DELETE requests
// ----------------------------------------------------------------------

/**
 * @swagger
 * tags:
 *   name: Dynamic Users - Super Admins
 *   description: APIs related to Dynamic Users
 */

/**
 * @swagger
 * /api/dynamicUsers/superAdmin/register:
 *   post:
 *     summary: Register a Super Admin account
 *     description: Creates a new Super Admin account with provided username and name.
 *     tags: [Dynamic Users - Super Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SuperAdminUserName:
 *                 type: string
 *                 example: superadmin
 *               SuperAdminName:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       '200':
 *         description: Successful operation
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
 *                   example: Super Admin account created successfully
 *                 superAdmin:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60e88bc894dbef1e6c04f507
 *                     SuperAdminUserName:
 *                       type: string
 *                       example: superadmin1
 *                     SuperAdminName:
 *                       type: string
 *                       example: John Doe
 *       '400':
 *         description: Invalid request or data
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
 *                   example: Invalid username format. Please use lowercase letters, numbers, underscore, and dot only.
 *       '406':
 *         description: Invalid request or data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 406
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Username already exists. Please choose a different one.
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

// Route to Register the Super Admin Account
superAdminRoutes.post("/superAdmin/register", async (req, res) => {
  await connectDB();
  try {
    const { SuperAdminUserName, SuperAdminName } = req.body;

    const usernamePattern = /^[a-z0-9_\.]+$/;
    if (!usernamePattern.test(SuperAdminUserName)) {
      return res.status(200).json({
        statusCode: 400,
        status: false,
        message:
          "Invalid username format. Please use lowercase letters, numbers, underscore, and dot only.",
      });
    }

    const superAdmin = await SuperAdmin.create({
      SuperAdminUserName,
      SuperAdminName,
    });

    res.status(200).json({
      statusCode: 200,
      status: true,
      message: "Super Admin account created successfully",
      superAdmin: superAdmin,
    });
    disconnectDB();
  } catch (error) {
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.SuperAdminUserName
    ) {
      return res.status(200).json({
        statusCode: 406,
        status: false,
        message: "Username already exists. Please choose a different one.",
      });
    }

    res.status(200).json({
      statusCode: 500,
      status: false,
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/dynamicUsers/superAdmin/get/{SuperAdminUserName}:
 *   get:
 *     summary: Get Super Admin account by username
 *     description: Retrieve the Super Admin account details by username.
 *     tags: [Dynamic Users - Super Admins]
 *     parameters:
 *       - in: path
 *         name: SuperAdminUserName
 *         required: true
 *         description: Username of the Super Admin account to retrieve.
 *         schema:
 *           type: string
 *         example: superadmin
 *     responses:
 *       '200':
 *         description: Super Admin account found
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
 *                   example: Super Admin account found
 *                 superAdmin:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60e88bc894dbef1e6c04f507
 *                     SuperAdminUserName:
 *                       type: string
 *                       example: superadmin1
 *                     SuperAdminName:
 *                       type: string
 *                       example: John Doe
 *       '404':
 *         description: Super Admin account not found
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
 *                   example: Super Admin account not found
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

//Route to GET the Super Admin Account by username
superAdminRoutes.get(
  "/superAdmin/get/:SuperAdminUserName",
  async (req, res) => {
    await connectDB();
    try {
      const { SuperAdminUserName } = req.params;
      const superAdmin = await SuperAdmin.findOne({ SuperAdminUserName });

      if (!superAdmin) {
        return res.status(200).json({
          statusCode: 404,
          status: false,
          message: "Super Admin account not found",
        });
      }

      res.status(200).json({
        statusCode: 200,
        status: true,
        message: "Super Admin account found",
        superAdmin: superAdmin,
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
 * /api/dynamicUsers/superAdmin/delete/{SuperAdminUserName}:
 *   delete:
 *     summary: Delete Super Admin account by username
 *     description: Deletes the Super Admin account identified by the username.
 *     tags: [Dynamic Users - Super Admins]
 *     parameters:
 *       - in: path
 *         name: SuperAdminUserName
 *         required: true
 *         description: Username of the Super Admin account to delete.
 *         schema:
 *           type: string
 *         example: superadmin
 *     responses:
 *       '200':
 *         description: Super Admin account deleted successfully
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
 *                   example: Super Admin account and all associated data deleted successfully
 *       '404':
 *         description: Super Admin account not found
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
 *                   example: Super Admin account not found
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

// Route to delete the Super Admin Account by username
superAdminRoutes.delete(
  "/superAdmin/delete/:SuperAdminUserName",
  async (req, res) => {
    await connectDB();
    try {
      const { SuperAdminUserName } = req.params;
      const superAdmin = await SuperAdmin.findOneAndDelete({
        SuperAdminUserName,
      });

      if (!superAdmin) {
        return res.status(200).json({
          statusCode: 404,
          status: false,
          message: "Super Admin account not found",
        });
      }

      // Delete associated data
      await DynamicUsersData.deleteMany({
        superAdminUserName: SuperAdminUserName,
      });

      res.status(200).json({
        statusCode: 200,
        status: true,
        message:
          "Super Admin account and all associated data deleted successfully",
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

// Cron job to check for inactive Super Admins every day at midnight
cron.schedule(
  "0 0 * * *", // Runs every day at midnight
  async () => {
    await connectDB();
    try {
      const superAdmins = await SuperAdmin.find();
      const currentDateIndia = getCurrentDateTimeIndia();
      const deletedSuperAdmins = [];

      // Loop through Super Admins to check for inactivity
      for (const superAdmin of superAdmins) {
        const lastAccessedDate = new Date(superAdmin.lastAccessed);
        const currentDate = new Date(currentDateIndia);

        // Calculate the difference in milliseconds
        const differenceInMs = currentDate - lastAccessedDate;

        // Convert milliseconds to days
        const differenceInDays = Math.floor(
          differenceInMs / (1000 * 60 * 60 * 24)
        );

        console.log(
          `\nSuper Admin => User Name: ${superAdmin.SuperAdminUserName} => Name: ${superAdmin.SuperAdminName}`
            .yellow.bgRed.bold.underline
        );

        console.log(
          `Inactive from ${superAdmin.lastAccessed} to ${currentDateIndia} for ${differenceInDays} days!`
            .yellow.bgRed.bold.underline
        );

        // Check if the Super Admin has been inactive for 28 days
        if (differenceInDays >= 28) {
          deletedSuperAdmins.push(superAdmin);

          console.log(
            "\n----------------------------------------------------------"
          );
          console.log(
            `Super Admin ${superAdmin.SuperAdminUserName} has been inactive for 28 days. Deleting the account...`
              .cyan.bold
          );

          // Delete the Super Admin
          await SuperAdmin.deleteOne({ _id: superAdmin._id });

          console.log(
            `Super Admin ${superAdmin.SuperAdminUserName} deleted successfully!\n`
              .cyan.bold
          );
          console.log(
            "----------------------------------------------------------"
          );

          // Delete all documents in DynamicUsersData collection associated with this Super Admin
          await DynamicUsersData.deleteMany({
            SuperAdminUserName: superAdmin.SuperAdminUserName,
          });
        }
      }
      disconnectDB();
    } catch (error) {
      console.error("Cron job error:", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

module.exports = superAdminRoutes;

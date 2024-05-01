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

// Route to Register the Super Admin Account
superAdminRoutes.post("/register/superadmin", async (req, res) => {
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
        statusCode: 400,
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

//Route to GET the Super Admin Account by username
superAdminRoutes.get(
  "/get/superadmin/:SuperAdminUserName",
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

// Route to delete the Super Admin Account by username
superAdminRoutes.delete(
  "/delete/superadmin/:SuperAdminUserName",
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

      res.status(200).json({
        statusCode: 200,
        status: true,
        message: "Super Admin account deleted successfully",
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

// Route to Create a multiple User Accounts under a Super Admin Account
superAdminRoutes.post(
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

//Route to GET all the User Accounts under a Super Admin Account
superAdminRoutes.get(
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

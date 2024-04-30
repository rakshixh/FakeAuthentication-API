const express = require("express");
const superAdminRoutes = express.Router();
const SuperAdmin = require("../models/dynamicUsers");
const DynamicUsersData = require("../models/dynamicUsersData");
const { connectDB, disconnectDB } = require("../config/db");
const { getCurrentDateTimeIndia } = require("../utilities/CurrentDate");

// @desc These are Dynamic APIs with only GET, POST, PUT, DELETE requests
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

module.exports = superAdminRoutes;

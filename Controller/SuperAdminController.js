const express = require("express");
const superAdminRoutes = express.Router();
const User = require("../models/staticUsers");
const SuperAdmin = require("../models/dynamicUsers");
const { connectDB, disconnectDB } = require("../config/db");

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

module.exports = superAdminRoutes;

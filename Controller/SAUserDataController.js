const express = require("express");
const SAUsersDataRoutes = express.Router();
const SuperAdmin = require("../models/dynamicUsers");
const DynamicUsersData = require("../models/dynamicUsersData");
const { connectDB, disconnectDB } = require("../config/db");
const { getCurrentDateTimeIndia } = require("../utilities/CurrentDate");

// @desc These are Dynamic APIs with only GET, POST, PUT, DELETE requests
// ----------------------------------------------------------------------

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

module.exports = SAUsersDataRoutes;

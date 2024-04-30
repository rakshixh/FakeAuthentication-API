const mongoose = require("mongoose");

const dynamicUsersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Ensures uniqueness
      lowercase: true,
      match: /^[a-z0-9_\.]+$/,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures uniqueness
    },
    role: {
      type: String,
      enum: ["guest", "user", "admin"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipcode: {
        type: String,
        required: true,
      },
    },
    SuperAdminUserName: {
      type: String,
      required: true,
    },
  },
  { collection: "dynamicUsersData" } // Define collection name here
);

const DynamicUsersData = mongoose.model("DynamicUsersData", dynamicUsersSchema);

module.exports = DynamicUsersData;

const mongoose = require("mongoose");
const { getCurrentDateTimeIndia } = require("../utilities/CurrentDate");

const superAdminSchema = new mongoose.Schema(
  {
    SuperAdminUserName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[a-z0-9_\.]+$/,
    },
    SuperAdminName: {
      type: String,
      required: true,
    },
    lastAccessed: {
      type: String,
      default: getCurrentDateTimeIndia(),
    },
  },
  { collection: "dynamicUsers" } // Define collection name here
);

// Create the SuperAdmin model
const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);

module.exports = SuperAdmin;

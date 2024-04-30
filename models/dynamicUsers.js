const mongoose = require("mongoose");

// Get the current date
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, "0");
const day = String(currentDate.getDate()).padStart(2, "0");
const formattedDate = `${year}-${month}-${day}`;

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
      default: formattedDate,
    },
  },
  { collection: "dynamicUsers" } // Define collection name here
);

// Create the SuperAdmin model
const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);

module.exports = SuperAdmin;

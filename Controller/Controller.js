const express = require("express");
const apiRoutes = express.Router();

// Import JSON data from Data.js initially
let jsonData = require("./AuthData");

// Function to update jsonData with fresh data from Data.js
const updateData = () => {
  try {
    delete require.cache[require.resolve("./AuthData")]; // Clear cache to force re-import
    jsonData = require("./AuthData");
    console.log("Data updated at: ", new Date());
  } catch (error) {
    console.error("Error updating data:", error);
  }
};

// Call updateData initially and then every 60 minutes
updateData(); // Initial update
const interval = setInterval(updateData, 60 * 60 * 1000);

// Route to get all users
apiRoutes.get("/users", (req, res) => {
  try {
    // Combine all users from jsonData
    const allUsers = [].concat(
      jsonData.guests,
      jsonData.users,
      jsonData.admins
    );
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = apiRoutes;

const express = require("express");
const router = express.Router();
const userRoutes = require("../Controller/UserController");
const superAdminRoutes = require("../Controller/SuperAdminController");
const SAUsersDataRoutes = require("../Controller/SAUserDataController");

router.use("/staticUsers", userRoutes);
router.use("/dynamicUsers", superAdminRoutes, SAUsersDataRoutes);
module.exports = router;

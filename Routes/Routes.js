const express = require("express");
const router = express.Router();
const userRoutes = require("../Controller/UserController");
const superAdminRoutes = require("../Controller/SuperAdminController");

router.use("/staticUsers", userRoutes);
router.use("/dynamicUsers", superAdminRoutes);
module.exports = router;

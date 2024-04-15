const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// Route to get data for the dashboard based on username
router.get("/:username", dashboardController.getDashboardData);

module.exports = router;

const TestResult = require("../models/TestResult");
const { validationResult } = require("express-validator");

// Controller method to get data for the dashboard based on username
exports.getDashboardData = async (req, res) => {
  try {
    const { username } = req.params; // Assuming username is passed as a parameter in the GET request
    const userData = await TestResult.find({ username });

    res.status(200).json({ success: true, data: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

const TestResult = require("../models/TestResult");

// routes/yourRoutes.js
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const testController = require("../controllers/testController");

/*
// Define API endpoint using async/await
router.post("/", async (req, res) => {
  const { username, title, score } = req.body;

  try {
    const result = await TestResult.create({ username, title, score });
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

*/

// routes/test.js

router.get("/user", testController.getTestResultsByUser);

module.exports = router;
router.post("/", testController.saveTestResult);
router.get("/", testController.getAllTestResults);
router.get("/user", testController.getTestResultsByUser);
module.exports = router;

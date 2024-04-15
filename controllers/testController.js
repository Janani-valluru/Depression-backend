// controllers/testController.js
const TestResult = require("../models/TestResult");

exports.saveTestResult = async (req, res) => {
  try {
    const { score, username, title, type_id } = req.body;
    const result = new TestResult({ score, username, title, type_id });
    await result.save();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.getAllTestResults = async (req, res) => {
  try {
    let results;

    if (req.query && req.query.username != null) {
      results = await TestResult.find({ username: req.query.username });
    } else {
      results = await TestResult.find({});
    }
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.getTestResultsByUser = async (req, res) => {
  try {
    const { username } = req.query;
    const results = await TestResult.find({ username });
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

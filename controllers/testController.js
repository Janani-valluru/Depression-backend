const TestResult = require("../models/TestResult");

async function saveTestResult(req, res) {
  try {
    const { score, username, title } = req.body;
    console.log(req.body);
    const result = new TestResult({ score, username, title });
    await result.save();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
async function GetTestResult(req, res) {
  const results = await TestResult.find();
  console.log(results);
  res.json(results);
}

module.exports = { saveTestResult, GetTestResult };

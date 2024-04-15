const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type_id: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  score: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// Define a static method to get the latest results
testResultSchema.statics.getLatestResults = async function (limit = 50) {
  try {
    const latestResults = await this.find()
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .limit(limit)

      .exec();
    return latestResults;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("TestResult", testResultSchema);

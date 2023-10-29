const Quiz = require("../../models/Quiz");
const Analytics = require("../../models/Analytics");

async function getAnalyticsData(userId) {
  return await Analytics.find({
    createdBy: userId,
    isDeleted: false,
  }).lean();
}

async function getQuizzes(userId) {
  return await Quiz.find({ createdBy: userId }).lean();
}

function createMapQuizToId(quizzes) {
  const quizToId = {};

  for (const quiz of quizzes) {
    quizToId[quiz._id] = quiz;
  }

  return quizToId;
}

function getQuestionById(quiz, qId) {
  return quiz.questions.find((q) => q._id.toString() === qId);
}

module.exports = {
  getAnalyticsData,
  getQuizzes,
  createMapQuizToId,
  getQuestionById,
};

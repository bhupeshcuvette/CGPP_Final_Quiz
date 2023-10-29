const mongoose = require("mongoose");

const actionSchema = new mongoose.Schema({
  qId: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["correct", "incorrect"],
    default: "incorrect",
  },
  optionId: {
    type: String,
    required: true,
  },
  isTimeOut: {
    type: Boolean,
    default: false,
  },
});

const participantSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  actions: [actionSchema],
  quizEndedAt: {
    type: Date,
    default: Date.now,
  },
});

const analyticsSchema = new mongoose.Schema({
  createdBy: {
    type: String,
    required: true,
  },
  quizId: {
    type: String,
    required: true,
  },
  quizType: {
    type: String,
    enum: ["qna", "poll"],
    default: "poll",
  },
  quizCreateAt: {
    type: Date,
    default: Date.now,
  },
  quizName: {
    type: String,
    required: true,
  },
  participants: [participantSchema],
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Analytics", analyticsSchema);

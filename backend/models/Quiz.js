const mongoose = require("mongoose");

// option schema definition
const optionSchema = {
  index: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    default: "",
  },
  url: {
    type: String,
    default: "",
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
};

// question schema definition
const questionSchema = {
  question: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  optionType: {
    type: String,
    required: true,
    enum: ["text", "image", "text and image"],
    default: "text",
  },
  options: [optionSchema], // array of option objects
  timer: {
    type: String,
    required: true,
    enum: ["off", "5", "10"],
    default: "off",
  },
};

const quizSchema = new mongoose.Schema({
  createdBy: {
    type: String,
    required: true,
  },
  quizType: {
    type: String,
    required: true,
    enum: ["qna", "poll"],
    default: "poll",
  },
  name: {
    type: String,
    required: true,
  },
  questions: [questionSchema], // array of question objects
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Quiz", quizSchema);

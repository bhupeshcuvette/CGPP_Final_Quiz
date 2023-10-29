const router = require("express").Router();
const Quiz = require("../../models/Quiz");
const Analytics = require("../../models/Analytics");
const Joi = require("joi");
const authenticateJWT = require("../../middlewares/authenticateJWT");

// Defined a Joi schema for quiz
const quizSchema = Joi.object({
  createdBy: Joi.string().required(),
  quizType: Joi.string().valid("qna", "poll").required(),
  name: Joi.string().required(),
  questions: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().required(),
        index: Joi.number().required(),
        optionType: Joi.string()
          .valid("text", "image", "text and image")
          .required(),
        options: Joi.array()
          .items(
            Joi.object({
              index: Joi.number().required(),
              text: Joi.string().default("").empty(""),
              url: Joi.string().default("").empty(""),
              isCorrect: Joi.boolean().default(false),
            })
          )
          .min(2)
          .max(4),
        timer: Joi.string().valid("off", "5", "10").required().default("off"),
      })
    )
    .required()
    .min(1)
    .max(5),
});

// Create a new quiz
router.post("/create", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user._id; // Get the user's ID from the JWT token
    req.body.createdBy = userId;

    // Validate the request body against the quiz schema
    try {
      await quizSchema.validateAsync(req.body);
    } catch (error) {
      return res.status(400).send(error.details[0]);
    }

    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(200).send({ message: "Quiz created successfully", data: quiz });
  } catch (error) {
    // If any other error occurs, return a 500 Internal Server Error response.
    console.error("Internal Server Error ", error);
    res.status(500).send({ message: "Internal Server Error", error: error });
  }
});

// Update an existing quiz
router.put("/update/:quizId", authenticateJWT, async (req, res) => {
  try {
    // Validate the request body against the quiz schema
    try {
      await quizSchema.validateAsync(req.body);
    } catch (error) {
      return res.status(400).send(error.details[0]);
    }

    const quizId = req.params.quizId;
    const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, req.body, {
      new: true,
    });

    if (!updatedQuiz) {
      return res.status(404).send("Quiz not found");
    }

    res.status(200).send(updatedQuiz);
  } catch (error) {
    // If any other error occurs, return a 500 Internal Server Error response.
    console.error("Internal Server Error ", error);
    res.status(500).send({ message: "Internal Server Error", error: error });
  }
});

// Delete a quiz
router.delete("/delete/:quizId", authenticateJWT, async (req, res) => {
  const quizId = req.params.quizId;

  const deletedQuiz = await Quiz.findOneAndDelete({ _id: quizId });
  if (!deletedQuiz) {
    return res.status(404).send("Quiz not found");
  }

  // Update the analytics data for the quiz to mark it as deleted
  await Analytics.updateOne({ quizId }, { isDeleted: true });

  res.status(200).send({ message: "Quiz deleted successfully" });
});

// Read one quiz by ID
router.get("/:quizId", async (req, res) => {
  const quizId = req.params.quizId;
  const quiz = await Quiz.findById(quizId);

  if (!quiz) {
    return res.status(404).send("Quiz not found");
  }

  res.status(200).send(quiz);
});

// Read all quizzes
router.get("/", authenticateJWT, async (req, res) => {
  const userId = req.user._id; // Get the user's ID from the JWT token

  try {
    // Find quizzes where createdBy matches the user's ID
    const quizzes = await Quiz.find({ createdBy: userId });
    res.status(200).send(quizzes);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

const router = require("express").Router();
const Analytics = require("../../models/Analytics");
const authenticateJWT = require("../../middlewares/authenticateJWT");
const Joi = require("joi");
const {
  getAnalyticsData,
  getQuizzes,
  createMapQuizToId,
  getQuestionById,
} = require("./service");

// Defined a Joi schema for actions
const actionSchema = Joi.object({
  qId: Joi.string().required(),
  index: Joi.number().required(),
  status: Joi.string().valid("correct", "incorrect").default("incorrect"),
  optionId: Joi.string().required(),
  isTimeOut: Joi.boolean().default(false),
});

// Defined a Joi schema for participants
const participantSchema = Joi.object({
  id: Joi.string().required(),
  actions: Joi.array().items(actionSchema).default([]),
  quizEndedAt: Joi.date().default(Date.now),
});

// Defined a Joi schema for the request body
const analyticsSchema = Joi.object({
  quizId: Joi.string().required(),
  createdBy: Joi.string().required(),
  quizType: Joi.string().valid("qna", "poll").required(),
  quizCreateAt: Joi.date().default(Date.now).required(),
  quizName: Joi.string().required(),
  participants: Joi.array().items(participantSchema).default([]),
  isDeleted: Joi.boolean().default(false),
});

// Create a analytics data
router.post("/create", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user._id; // Get the user's ID from the JWT token
    req.body.createdBy = userId;

    // Validate the request body against the analytics schema
    try {
      await analyticsSchema.validateAsync(req.body);
    } catch (error) {
      return res.status(400).send(error.details[0]);
    }

    const analytics = new Analytics(req.body);
    await analytics.save();
    res.status(200).send({
      message: "Analytics data created successfully",
      data: analytics,
    });
  } catch (error) {
    // If any other error occurs, return a 500 Internal Server Error response.
    console.error("Internal Server Error ", error);
    res.status(500).send({ message: "Internal Server Error", error: error });
  }
});

// Add a participant to the Analytics data based on the quizId
router.post("/add-participant/:quizId", async (req, res) => {
  try {
    const quizId = req.params.quizId;

    // Validate the request body against the participants schema
    try {
      await participantSchema.validateAsync(req.body);
    } catch (error) {
      return res.status(400).send(error.details[0]);
    }

    let analytics = await Analytics.findOne({ quizId });

    if (!analytics) {
      return res.status(404).json({ error: "Analytics data not found" });
    }

    analytics.participants.push(req.body);
    await analytics.save();

    return res.status(200).json({ message: "Participant added to Analytics" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update-participant/:quizId/:participantId", async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const participantId = req.params.participantId;

    const analytics = await Analytics.findOne({ quizId });
    if (!analytics) {
      return res.status(404).json({ error: "Analytics data not found" });
    }

    // Finding the participant within the participants array based on participantId
    const participant = analytics.participants.find(
      (p) => p.id === participantId
    );

    if (!participant) {
      return res.status(404).json({ error: "Participant not found" });
    }
    // Update the participant's data
    participant.actions = req.body;
    await analytics.save();

    return res
      .status(200)
      .json({ message: "Participant data updated in Analytics" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get analytics data for a quiz
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user._id; // Get the user's ID from the JWT token
    const userAnalytics = await getUserAnalytics(userId);

    return res.status(200).json(userAnalytics);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

async function getUserAnalytics(userId) {
  const [analytics, quizzes] = await Promise.all([
    getAnalyticsData(userId),
    getQuizzes(userId),
  ]);

  if (analytics.length === 0) {
    return { error: "Analytics data not found" };
  }

  const userAnalytics = {
    totalQuizzes: quizzes.length,
    totalQuestions: 0,
    totalImpressions: 0,
    data: [],
  };

  const mapQuizToId = createMapQuizToId(quizzes);

  for (const quizAnalytic of analytics) {
    const quiz = mapQuizToId[quizAnalytic.quizId];
    if (quiz && quiz._id.toString() === quizAnalytic.quizId) {
      const updatedQuizAnalytic = processQuizAnalytic(quizAnalytic, quiz);
      userAnalytics.data.push(updatedQuizAnalytic);
      userAnalytics.totalQuestions += quiz.questions.length;
      userAnalytics.totalImpressions += updatedQuizAnalytic.impression;
    }
  }

  return userAnalytics;
}

function processQuizAnalytic(quizAnalytic, quiz) {
  const updatedQuizAnalytic = { ...quizAnalytic };
  updatedQuizAnalytic.quizName = quiz.name;
  updatedQuizAnalytic.impression = quizAnalytic.participants.length;
  updatedQuizAnalytic.questionWiseStats = {};

  for (const question of quiz.questions) {
    updatedQuizAnalytic.questionWiseStats[question._id] = {
      totalCorrect: 0,
      totalIncorrect: 0,
      totalAttempted: 0,
      options: {
        "-1": 0, // totalAttempted for unanswered
      },
    };

    for (const option of question.options) {
      updatedQuizAnalytic.questionWiseStats[question._id].options[
        option._id
      ] = 0; // totalAttempted for each option
    }
  }

  for (const participant of quizAnalytic.participants) {
    for (const action of participant.actions) {
      if (updatedQuizAnalytic.questionWiseStats[action.qId]) {
        updatedQuizAnalytic.questionWiseStats[action.qId].totalAttempted += 1;
        updatedQuizAnalytic.questionWiseStats[action.qId].options[
          action.optionId
        ] += 1;
        if (action.status === "correct") {
          updatedQuizAnalytic.questionWiseStats[action.qId].totalCorrect += 1;
        } else {
          updatedQuizAnalytic.questionWiseStats[action.qId].totalIncorrect += 1;
        }
      }
    }
  }
  return updatedQuizAnalytic;
}

module.exports = router;

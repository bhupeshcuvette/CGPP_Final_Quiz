const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json()); // JSON Output
app.use(cors()); // Disabling CORS

app.get("/", (req, res) => {
  res.send(`Hello World!!`);
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "=================== Connected to Database ==================="
    );
  })
  .catch((err) => {
    console.log(err);
  });

const authRoute = require("./routes/auth/auth");
const quizRoute = require("./routes/quiz/quiz");
const analyticsRoute = require("./routes/analytics/analytics");

app.use("/api/users", authRoute);
app.use("/api/quiz", quizRoute);
app.use("/api/analytics", analyticsRoute);

app.listen(PORT, () => console.log(`server up and running at  ${PORT}`));

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Joi = require("joi");

// Defined the schema for user registration
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string()
    .min(6)
    .max(255)
    .required()
    .email({ minDomainSegments: 2 }),
  password: Joi.string().min(1).required(),
});

// Handling the registration route
router.post("/register", async (req, res) => {
  try {
    const isEmailExist = await User.findOne({ email: req.body.email });
    if (isEmailExist) {
      return res.status(400).send({ message: "Email already exists" });
    }

    // Generate a salt for password hashing.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Validate the request body against the registration schema.
    try {
      await registerSchema.validateAsync(req.body);
    } catch (error) {
      return res.status(400).send(error.details[0]);
    }

    // New User instance with the provided data.
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    await user.save();
    res.status(200).send({ message: "New user created successfully" });
  } catch (error) {
    // If any other error occurs, return a 500 Internal Server Error response.
    console.error("Internal Server Error ", error);
    res.status(500).send({ message: "Internal Server Error", error: error });
  }
});

// Defined the validation schema for user login
const loginSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(255)
    .required()
    .email({ minDomainSegments: 2 }),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,255}$/)
    .min(6)
    .max(255)
    .required(),
});

// Handling the login route.
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send({ message: "Email ID Doesn't Exist" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send({ message: "Incorrect Password" });

    // Validate the request body against the login schema.
    try {
      await loginSchema.validateAsync(req.body);
    } catch (error) {
      return res.status(400).send(error.details[0]);
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.header("auth-token", token).send({ token });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

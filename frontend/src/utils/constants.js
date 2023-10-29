const LOGIN = "login";
const SIGNUP = "signup";
const LOGIN_TEXT = "Log In";
const SIGNUP_TEXT = "Sign Up";
const USER_INFO = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
const ERROR_INFO = { ...USER_INFO };
const SHOW_ERROR_INFO = {
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
};
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;
const LOWER_CASE_REGEX = /[a-z]/;
const UPPER_CASE_REGEX = /[A-Z]/;
const DIGIT_REGEX = /\d/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
const DASHBOARD = "dashboard";
const ANALYTICS = "analytics";
const CREATE_QUIZ = "createquiz";
const OPTIONS = {
  index: 0,
  text: "",
  url: "",
  isCorrect: false,
};
const QUESTION = {
  question: "",
  optionType: "text",
  options: [{ ...OPTIONS }, { ...OPTIONS }],
  timer: "off",
};
const QUIZ = {
  createdBy: "",
  quizType: "",
  name: "",
  questions: [{ ...QUESTION }],
};

export {
  LOGIN,
  SIGNUP,
  LOGIN_TEXT,
  SIGNUP_TEXT,
  USER_INFO,
  ERROR_INFO,
  EMAIL_REGEX,
  LOWER_CASE_REGEX,
  UPPER_CASE_REGEX,
  DIGIT_REGEX,
  PASSWORD_REGEX,
  SHOW_ERROR_INFO,
  DASHBOARD,
  ANALYTICS,
  CREATE_QUIZ,
  OPTIONS,
  QUESTION,
  QUIZ,
};

import { EMAIL_REGEX, ERROR_INFO } from "./constants";

export const validate = (userInfo) => {
  const error = { ...ERROR_INFO };

  if (userInfo.name.length < 3) error.name = "Invalid name";
  if (!EMAIL_REGEX.test(userInfo.email)) error.email = "Invalid email";
  if (userInfo.password.length < 1) error.password = "Password is required";
  if (
    userInfo.password !== userInfo.confirmPassword ||
    userInfo.confirmPassword === ""
  )
    error.confirmPassword = "password don't match";

  return {
    isError: true,
    error,
  };
};

export const isPasswordAndConfirmPasswordSame = (userInfo) =>
  userInfo.password === userInfo.confirmPassword;

export const formatDateToCustomString = (isoTimestamp) => {
  const date = new Date(isoTimestamp);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const customDateString = `${day} ${month}, ${year}`;

  return customDateString;
};

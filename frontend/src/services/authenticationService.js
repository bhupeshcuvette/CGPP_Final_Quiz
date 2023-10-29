import http from "../utils/http";

export const signUpUser = async (body) => {
  try {
    delete body.confirmPassword;

    const response = await http.post("users/register", body);

    return response;
  } catch (error) {
    return {
      error,
    };
  }
};

export const signInUser = async (body) => {
  try {
    delete body.confirmPassword;
    delete body.name;

    const response = await http.post("users/login", body);

    return response;
  } catch (error) {
    return {
      error,
    };
  }
};

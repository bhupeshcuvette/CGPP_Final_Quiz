import axios from "axios";
import { toast } from "react-toastify";

const getToken = () => {
  let token = localStorage.getItem("jwt_auth_token");
  return token;
};

const instance = axios.create({
  baseURL: "http://localhost:3333/api",
  headers: {
    "auth-token": getToken(),
  },
});

instance.interceptors.request.use(
  async function beforeRequest(config) {
    return config;
  },
  function afterRequest(error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function successResponse(response) {
    return response.data;
  },
  function errorResponse(error) {
    console.log(error);
    let message = error.response.data.message;
    const statusCode = error.response.status;

    if (typeof error.response.data === "string") {
      message = error.response.data;
    }

    if (statusCode === 401 || message === "Invalid Token") {
      toast.error("Your session has expired, please start a new session!");
    }

    if (statusCode >= 500)
      toast.error("Something went wrong. Try again after some time.");
    else {
      toast.error(message);
    }

    return Promise.reject(error.response.data);
  }
);

export default instance;

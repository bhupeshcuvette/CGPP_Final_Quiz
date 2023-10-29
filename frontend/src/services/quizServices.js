import http from "../utils/http";

export const getAllQuiz = async () => {
  try {
    const response = await http.get("/quiz");

    return response;
  } catch (error) {
    return {
      error,
    };
  }
};

export const createQuiz = async (body) => {
  try {
    const response = await http.post("/quiz/create", body);

    return response;
  } catch (error) {
    return {
      error,
    };
  }
};

export const getQuiz = async (id) => {
  try {
    const response = await http.get(`/quiz/${id}`);

    return response;
  } catch (error) {
    return {
      error,
    };
  }
};

export const deleteQuiz = async (id) => {
  try {
    const response = await http.delete(`/quiz/delete/${id}`);

    return response;
  } catch (error) {
    return {
      error,
    };
  }
};

export const editQuiz = async (body, id) => {
  try {
    const response = await http.put(`/quiz/update/${id}`, body);

    return response;
  } catch (error) {
    return {
      error,
    };
  }
};

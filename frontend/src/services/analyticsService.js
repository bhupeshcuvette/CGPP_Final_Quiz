import http from "../utils/http";

export const getAnalytics = async () => {
  try {
    const response = await http.get("/analytics");

    return response;
  } catch (err) {
    return {
      err,
    };
  }
};

export const createAnalytics = async (body) => {
  try {
    const response = await http.post("/analytics/create", body);

    return response;
  } catch (err) {
    return {
      err,
    };
  }
};

export const createParticipant = async (body, quizId) => {
  try {
    const response = await http.post(
      "/analytics/add-participant/" + quizId,
      body
    );

    return response;
  } catch (err) {
    return {
      err,
    };
  }
};

export const submitParticipantQuizOption = async (body, quizId, uid) => {
  try {
    const response = await http.put(
      `/analytics/update-participant/${quizId}/${uid}`,
      body
    );

    return response;
  } catch (err) {
    return {
      err,
    };
  }
};

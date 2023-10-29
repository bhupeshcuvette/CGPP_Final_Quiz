import { formatDateToCustomString } from "../utils/validation";
import "../styling/quizAnalysisStyles.css";
import { useEffect, useState } from "react";
import { getQuiz } from "../services/quizServices";
import { useNavigate } from "react-router-dom";
import { useAnalytics } from "../context/analytics.context";

const QuizAnalysisContainer = () => {
  const [quiz, setQuiz] = useState();
  const [analysis, setAnalysis] = useState();
  const navigate = useNavigate();

  const { analyticsData } = useAnalytics();

  useEffect(() => {
    const getAllQuizzes = async () => {
      const quizId = window.location.pathname.split("/")[5];

      const response = await getQuiz(quizId);
      if ("error" in response) {
        navigate("/quizapp/dashboard/analytics");
        return;
      }

      let quizAnalysis = {};
      quizAnalysis = analyticsData?.data?.find(
        (quiz) => quiz.quizId === quizId
      );
      setQuiz(response);
      if (quizAnalysis) setAnalysis(quizAnalysis);
    };

    getAllQuizzes();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="quizAnalysis">
      {quiz && (
        <>
          <div className="heading">
            <div className="quiz_name">{quiz.name} Analysis</div>
            <div className="quiz_info">
              <span>
                Created On: {formatDateToCustomString(quiz.createdAt)}
              </span>
              <span>Impressions: {analysis?.impression}</span>
            </div>
          </div>
          <div className="questionList">
            {quiz.questions.map((question, index) => {
              return (
                <>
                  {quiz.quizType === "qna" && (
                    <div className="questionAnalysis">
                      <div className="questionValue">
                        Q.{index + 1} {question.question}
                      </div>
                      <div className="questionStatistics">
                        <div className="qna_options flexCenter">
                          <span className="option_number">
                            {
                              analysis?.questionWiseStats[question._id]
                                .totalAttempted
                            }
                          </span>
                          <span>People Attempted the question</span>
                        </div>
                        <div className="qna_options flexCenter">
                          <span className="option_number">
                            {
                              analysis?.questionWiseStats[question._id]
                                .totalCorrect
                            }
                          </span>
                          <span>People Answered Correctly</span>
                        </div>
                        <div className="qna_options flexCenter">
                          <span className="option_number">
                            {
                              analysis?.questionWiseStats[question._id]
                                .totalIncorrect
                            }
                          </span>
                          <span>People Answered Incorrectly</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {quiz.quizType === "poll" && (
                    <div className="questionAnalysis">
                      <div className="questionValue">
                        Q.{index + 1} {question.question}
                      </div>
                      <div className="questionStatistics1 flexCenter">
                        {question.options.map((option) => {
                          return (
                            <div
                              key={option?._id}
                              className="options flexCenter"
                            >
                              <span className="option_number">
                                {
                                  analysis?.questionWiseStats[question._id]
                                    ?.options[option._id]
                                }
                              </span>
                              {`Option ${option?.index + 1}`}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default QuizAnalysisContainer;

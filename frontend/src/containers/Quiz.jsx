import { useEffect, useRef, useState } from "react";
import { getQuiz } from "../services/quizServices";
import { toast } from "react-toastify";
import uuid from "react-uuid";
import {
  createParticipant,
  submitParticipantQuizOption,
} from "../services/analyticsService";
import Trophy from "../assets/images/trophy.png";

const Quiz = () => {
  const [quiz, setQuiz] = useState(null);
  const [uid] = useState(uuid()); // when a user refreshes the page start the new session.
  const [question, setQuestion] = useState(0);
  const [timer, setTimer] = useState(-1);
  const [startTimer, setStartTimer] = useState(false);
  const [optionSelect, setOptionSelect] = useState(-1);
  const [continuousArray, setContinuousArray] = useState([]);
  const timerInterval = useRef(null);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const paths = window.location.pathname.split("/");
        const quizId = paths[paths.length - 1];
        const response = await getQuiz(quizId);
        if ("error" in response) {
          toast.error("Please try again later");
        } else {
          setQuiz(response);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    }
    fetchQuiz();
  }, []);

  useEffect(() => {
    if (quiz) {
      async function createNewParticipant() {
        try {
          const response = await createParticipant({ id: uid }, quiz._id);
          if ("err" in response) {
            toast.error("Something went wrong");
          }
        } catch (error) {
          console.error("Error creating participant:", error);
        }
      }
      createNewParticipant();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz]);

  useEffect(() => {
    if (!quiz || question === quiz.questions.length) return;

    const currentQuestion = quiz.questions[question];
    if (currentQuestion.timer === "off") {
      setStartTimer(false); // Reset the timer
      return;
    }

    setTimer(currentQuestion.timer);
    setStartTimer(true);
  }, [question, quiz]);

  useEffect(() => {
    if (!startTimer) {
      return;
    }
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    timerInterval.current = setTimeout(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        clearInterval(timerInterval.current);
        handleSubmit();
      }
    }, 1000);
    // eslint-disable-next-line
  }, [startTimer, timer]);

  const handleSubmit = async () => {
    if (question === quiz.questions.length) {
      return;
    }

    const isTimeOut = timer === 0;
    const isCorrect =
      optionSelect === -1
        ? false
        : quiz?.questions[question].options[optionSelect].isCorrect;
    const qId = quiz.questions[question]._id;
    const optionId =
      optionSelect === -1
        ? "-1"
        : quiz.questions[question].options[optionSelect]._id;

    const body = {
      isTimeOut,
      status: isCorrect ? "correct" : "incorrect",
      index: question,
      qId,
      optionId,
    };

    try {
      const response = await submitParticipantQuizOption(
        [...continuousArray, body],
        quiz._id,
        uid
      );
      if ("err" in response) {
        toast.error("Please try again");
      } else {
        const tempArray = [...continuousArray, body];
        setContinuousArray(tempArray);
        setQuestion(question + 1);
        setOptionSelect(-1);
        setTimer(-1);
        setStartTimer(false); // Reset the timer for the new question
      }
    } catch (error) {
      console.error("Error submitting participant quiz option:", error);
    }
  };

  const handleOptionSelect = (index) => {
    setOptionSelect(index);
  };

  return (
    <div className="quizGive0 flexCenter">
      <div className="quizGive">
        {quiz && question < quiz.questions.length && (
          <>
            <div className="flexCenter quiz_header">
              <p className="header_text">
                0{question + 1} / 0{quiz.questions.length}
              </p>
              {timer !== -1 && startTimer && (
                <p className="timer">
                  00:{parseInt(timer) === 10 ? 10 : `0${timer}`}s
                </p>
              )}
            </div>
            <div className="question">{quiz.questions[question].question}</div>
            <div className="options_container">
              {quiz.questions[question].options.map((option, index) => (
                <div key={option.index}>
                  {quiz.questions[question]?.optionType === "text" && (
                    <div
                      className={`${
                        optionSelect === index ? "activeOption" : ""
                      } option`}
                      onClick={() => handleOptionSelect(option.index)}
                    >
                      {option.text}
                    </div>
                  )}
                  {quiz.questions[question]?.optionType === "image" && (
                    <div
                      className={`option`}
                      onClick={() => handleOptionSelect(option.index)}
                    >
                      {option?.url && (
                        <div className="onlyImage">
                          <img
                            src={option.url}
                            alt="option"
                            className="optionsImage"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {quiz.questions[question]?.optionType ===
                    "text and image" && (
                    <div
                      className={`${
                        optionSelect === index ? "activeOption" : ""
                      } option optionWithImage`}
                      onClick={() => handleOptionSelect(option.index)}
                    >
                      {option?.text}
                      <div className="image">
                        <img
                          src={option.url}
                          alt="option"
                          className="optionsImage"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {quiz.questions[question].options.length <= 2 && (
                <div key="extra"></div>
              )}
            </div>
            <div className="button_container">
              <button className="inputForQuiz" onClick={handleSubmit}>
                {question === quiz.questions.length - 1 ? "SUBMIT" : "NEXT"}
              </button>
            </div>
          </>
        )}
        {quiz && question === quiz.questions.length && (
          <>
            {quiz.quizType === "qna" ? (
              <div className="result">
                <p className="header_text">Congrats Quiz is completed</p>
                <img className="trophy" src={Trophy} alt="trophy" />
                <p className="header_text">
                  Your score is{" "}
                  <span className="score">
                    0
                    {
                      continuousArray.filter(
                        (options) => options.status === "correct"
                      ).length
                    }{" "}
                    / 0{continuousArray.length}
                  </span>
                </p>
              </div>
            ) : (
              <div className="result poll_result">
                Thank you for participating in the Poll
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;

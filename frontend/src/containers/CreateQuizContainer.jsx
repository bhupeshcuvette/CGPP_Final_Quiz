import { useContext, useEffect, useState } from "react";
import { DashboardContext } from "./DashboardContainer";
import { ANALYTICS, OPTIONS, QUESTION } from "../utils/constants";
import "../styling/createQuizStyles.css";
import { toast } from "react-toastify";
import { createQuiz, editQuiz, getQuiz } from "../services/quizServices";
import { useNavigate } from "react-router-dom";
import { createAnalytics } from "../services/analyticsService";
import { useAnalytics } from "../context/analytics.context";
import DeleteIcon from "../assets/images/delete.png";
import CrossIcon from "../assets/images/cross.png";

const CreateQuizContainer = () => {
  const { setOpen, setDashboardTab } = useContext(DashboardContext);
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("");
  const [step, setStep] = useState("step1");
  const [newQuestion] = useState({ ...QUESTION });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionArray, setQuestionArray] = useState([{ ...newQuestion }]);
  const [copyText, setCopyText] = useState("");
  const [createdBy, setCreatedBy] = useState();
  const { quizId0, setQuizId0 } = useContext(DashboardContext);
  const { setAnalytics } = useAnalytics();
  const navigate = useNavigate();

  const handleAddNewQuestion = () => {
    const tempQuestionArray = [...questionArray, { ...QUESTION }];

    setQuestionArray(tempQuestionArray);
  };

  const handleAddNewOption = () => {
    const tempQuestionArray = [...questionArray];
    const tempOptionArray = [
      ...tempQuestionArray[questionIndex].options,
      { ...OPTIONS },
    ];
    tempQuestionArray[questionIndex].options = tempOptionArray;

    setQuestionArray(tempQuestionArray);
  };

  const handleSetQuestionTimer = (value) => {
    const tempQuestionArray = [...questionArray];
    const currentQuestion = { ...tempQuestionArray[questionIndex] };
    currentQuestion.timer = value;
    tempQuestionArray[questionIndex] = currentQuestion;

    setQuestionArray(tempQuestionArray);
  };

  const handleSetQuestionValue = (value) => {
    const tempQuestionArray = [...questionArray];
    const currentQuestion = { ...tempQuestionArray[questionIndex] };
    currentQuestion.question = value;
    tempQuestionArray[questionIndex] = currentQuestion;

    setQuestionArray(tempQuestionArray);
  };

  const handleOptionTypeSelect = (value) => {
    if (value === undefined) {
      toast.error("Please select a valid option type");
      return;
    }

    const tempQuestionArray = [...questionArray];
    const currentQuestion = { ...tempQuestionArray[questionIndex] };
    currentQuestion.optionType = value;
    currentQuestion.options = [{ ...OPTIONS }, { ...OPTIONS }];
    tempQuestionArray[questionIndex] = currentQuestion;

    setQuestionArray(tempQuestionArray);
  };

  const handleOptionsValueTextChange = (value, index) => {
    const tempQuestionArray = [...questionArray];
    const currentQuestion = { ...tempQuestionArray[questionIndex] };
    const optionsArray = [...currentQuestion.options];
    const currentOption = { ...optionsArray[index] };
    currentOption.text = value;
    optionsArray[index] = currentOption;
    currentQuestion.options = optionsArray;
    tempQuestionArray[questionIndex] = currentQuestion;

    setQuestionArray(tempQuestionArray);
  };

  const handleOptionsValueURLChange = (value, index) => {
    const tempQuestionArray = [...questionArray];
    const currentQuestion = { ...tempQuestionArray[questionIndex] };
    const optionsArray = [...currentQuestion.options];
    const currentOption = { ...optionsArray[index] };
    currentOption.url = value;
    optionsArray[index] = currentOption;
    currentQuestion.options = optionsArray;
    tempQuestionArray[questionIndex] = currentQuestion;

    setQuestionArray(tempQuestionArray);
  };

  const handleCorrectOption = (index) => {
    const tempQuestionArray = [...questionArray];
    const currentQuestion = { ...tempQuestionArray[questionIndex] };
    const optionsArray = [...currentQuestion.options];
    const currentOption = { ...optionsArray[index] };

    optionsArray.forEach(
      (optionsAgainEh) => (optionsAgainEh.isCorrect = false)
    );

    currentOption.isCorrect = true;
    optionsArray[index] = currentOption;
    currentQuestion.options = optionsArray;
    tempQuestionArray[questionIndex] = currentQuestion;

    setQuestionArray(tempQuestionArray);
  };

  const handleRemoveQuestion = (e, toRemoveIndex) => {
    e.stopPropagation();

    const tempQuestionArray = questionArray.filter(
      (_, index) => index !== toRemoveIndex
    );

    if (toRemoveIndex <= questionIndex) setQuestionIndex(questionIndex - 1);

    setQuestionArray(tempQuestionArray);
  };

  const handleDeleteOption = (e, toRemoveIndex) => {
    e.stopPropagation();

    const tempQuestionArray = [...questionArray];
    const currentQuestion = { ...tempQuestionArray[questionIndex] };
    const optionsArray = [...currentQuestion.options];
    const tempOptionArray = optionsArray.filter(
      (_, index) => index !== toRemoveIndex
    );

    currentQuestion.options = tempOptionArray;
    tempQuestionArray[questionIndex] = currentQuestion;

    setQuestionArray(tempQuestionArray);
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();

    if (quizName === "" || quizType === "") {
      toast.error(
        "Incomplete information filled, please fill quiz name and quiz type and proceed further"
      );
      return;
    }

    setStep("step2");
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();

    const tempQuestionArray = [...questionArray];
    tempQuestionArray.forEach((againOptions, index) => {
      const tempOptionsArray = [...againOptions.options];

      tempOptionsArray.forEach((insideOptions, index1) => {
        insideOptions.index = index1;
      });

      againOptions.options = tempOptionsArray;
      againOptions.index = index;
    });

    const quizFinalObj = {
      name: quizName,
      quizType,
      questions: tempQuestionArray,
      createdBy,
    };

    setQuestionArray(tempQuestionArray);

    let flag = false;

    if (quizFinalObj.questions === undefined) {
      flag = true;
    }

    quizFinalObj.questions.forEach((questions) => {
      if (questions.optionType === undefined || questions.optionType === "") {
        flag = true;
      }
      if (questions.options === undefined || questions.options.length === 0) {
        flag = true;
      }
      if (questions.question === undefined || questions.question === "") {
        flag = true;
      }

      if (questions.optionType === "text") {
        questions.options.forEach((againOptions) => {
          if (againOptions.text === "" || againOptions.text === undefined) {
            flag = true;
          }
        });
      }
      if (questions.optionType === "image") {
        questions.options.forEach((againOptions) => {
          if (againOptions.url === "" || againOptions.url === undefined) {
            flag = true;
          }
        });
      }
      if (questions.optionType === "text and image") {
        questions.options.forEach((againOptions) => {
          if (againOptions.text === "" || againOptions.text === undefined) {
            flag = true;
          }
          if (againOptions.url === "" || againOptions.url === undefined) {
            flag = true;
          }
        });
      }
    });

    if (flag === true) {
      toast.error("Please fill the quiz properly");

      return;
    }

    let response;

    quizFinalObj.questions.forEach((indiQues) => {
      if (indiQues._id) delete indiQues._id;

      indiQues.options.forEach((iniOption) => {
        if (iniOption._id) delete iniOption._id;
      });
    });

    if (!quizId0) {
      delete quizFinalObj.createdBy;

      response = await createQuiz(quizFinalObj);
    } else {
      response = await editQuiz(quizFinalObj, quizId0);

      if (!("error" in response)) {
        toast.success("Quiz edited Successfully!");

        setCopyText(window.location.origin + "/quiz/" + response._id);
        setStep("step3");
      }

      setQuizId0();
      return;
    }

    if ("error" in response) {
      toast.error("Failed to create Quiz, please try again!");

      return;
    }

    setCopyText(window.location.origin + "/quiz/" + response.data._id);

    const analyticsBody = {
      quizId: response.data._id,
      quizName: response.data.name,
      quizType: response.data.quizType,
      quizCreateAt: response.data.createdAt,
    };

    response = await createAnalytics(analyticsBody);

    if ("err" in response) {
      toast.error("Failed to create Quiz, please try again!");

      return;
    }

    toast.success("Quiz created successfully");

    setStep("step3");
    setAnalytics();
  };

  const handleCopyToClipboard = () => {
    const textToCopy = copyText;
    const tempInput = document.createElement("input");
    tempInput.value = textToCopy;

    setCopyText(textToCopy);

    document.body.appendChild(tempInput);

    tempInput.select();

    try {
      document.execCommand("copy");

      toast.success("Link copied to Clipboard");
    } catch (err) {
      toast.error("Please try again");
    } finally {
      document.body.removeChild(tempInput);
    }
  };

  useEffect(() => {
    if (quizId0) {
      const getQuizById = async () => {
        const response = await getQuiz(quizId0);
        if ("error" in response) {
          toast.error("Error fetching Quiz details to edit");
          return;
        }
        setQuestionArray([...response.questions]);
        setQuizName(response.name);
        setQuizType(response.quizType);
        setCreatedBy(response.createdBy);
      };
      getQuizById();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="createQuiz">
      {step === "step1" && (
        <div className="step1">
          <form>
            <input
              className="quizName"
              type="text"
              placeholder="Quiz Name"
              onChange={(e) => setQuizName(e.target.value)}
              value={quizName}
            />
            <div className="quizType flexCenter">
              <p className="flexCenter">Quiz Type</p>
              <p
                className={`flexCenter ${
                  quizType === "qna" ? "activeQuizType" : ""
                }`}
                onClick={() => setQuizType("qna")}
              >
                Q & A
              </p>
              <p
                className={`flexCenter ${
                  quizType === "poll" ? "activeQuizType" : ""
                }`}
                onClick={() => setQuizType("poll")}
              >
                Poll Type
              </p>
            </div>
            <div className="submitQuizType flexCenter">
              <input
                type="reset"
                value="Cancel"
                onClick={() => {
                  const url = window.location.pathname.split("/");
                  const dashboardtab = url[url.length - 1];
                  setQuizId0();
                  setOpen(false);
                  setDashboardTab(dashboardtab);
                }}
              />
              <input
                type="submit"
                value="Continue"
                onClick={handleStep1Submit}
              />
            </div>
          </form>
        </div>
      )}
      {step === "step2" && questionArray[questionIndex] !== undefined && (
        <div className="step2">
          <form>
            <div className="createQuizHeading">
              <div className="questionAdditionDiv">
                {questionArray.map((_, index) => {
                  return (
                    <div
                      key={index}
                      className={`flexCenter ${
                        questionIndex === index ? "activeQuestion" : ""
                      }`}
                      onClick={() => setQuestionIndex(index)}
                    >
                      {index + 1}
                      {index !== 0 && (
                        <p onClick={(e) => handleRemoveQuestion(e, index)}>
                          &#x2715;
                        </p>
                      )}
                    </div>
                  );
                })}
                {questionArray.length < 5 && (
                  <div
                    className="addQuestion flexCenter"
                    onClick={handleAddNewQuestion}
                  >
                    +
                  </div>
                )}
              </div>
              <div className="limitQuestion">Max 5 Questions</div>
            </div>
            <div className="questionInput">
              <input
                type="text"
                placeholder={`${quizType === "qna" ? "Q&A" : "Poll"} Question`}
                value={questionArray[questionIndex].question}
                onChange={(e) => handleSetQuestionValue(e.target.value)}
              />
            </div>
            <div
              className="questionOptionType flexCenter"
              onClick={(e) => handleOptionTypeSelect(e.target.value)}
            >
              <p className="option_text">Option Type</p>
              <div>
                <input
                  type="radio"
                  name="optionTypeRadio"
                  value="text"
                  checked={questionArray[questionIndex].optionType === "text"}
                />
                Text
              </div>
              <div>
                <input
                  type="radio"
                  name="optionTypeRadio"
                  value="image"
                  checked={questionArray[questionIndex].optionType === "image"}
                />
                Image URL
              </div>
              <div>
                <input
                  type="radio"
                  name="optionTypeRadio"
                  value="text and image"
                  checked={
                    questionArray[questionIndex].optionType === "text and image"
                  }
                />
                Text and Image URL
              </div>
            </div>
            <div className="optionsMainSection">
              <div className="optionAdditionDiv">
                {questionArray[questionIndex].options.map(
                  (optionsAgain, index) => {
                    return (
                      <>
                        {questionArray[questionIndex].optionType === "text" && (
                          <div
                            className="individualOptions flexCenter"
                            onClick={() => {
                              handleCorrectOption(index);
                            }}
                          >
                            {quizType === "qna" && (
                              <div
                                className={`select ${
                                  optionsAgain.isCorrect
                                    ? "correctIndividualOption"
                                    : ""
                                }`}
                              ></div>
                            )}
                            <input
                              type="text"
                              onChange={(e) =>
                                handleOptionsValueTextChange(
                                  e.target.value,
                                  index
                                )
                              }
                              className={`${
                                optionsAgain.isCorrect && quizType === "qna"
                                  ? "correctIndividualOption"
                                  : ""
                              } only_one_input`}
                              value={optionsAgain.text}
                              placeholder="Text"
                            />
                            {index > 1 && (
                              <div
                                className="delete"
                                onClick={(e) => handleDeleteOption(e, index)}
                              >
                                <img
                                  src={DeleteIcon}
                                  alt="delete"
                                  style={{ height: "24px" }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                        {questionArray[questionIndex].optionType ===
                          "image" && (
                          <div
                            className="individualOptions flexCenter"
                            onClick={() => {
                              handleCorrectOption(index);
                            }}
                          >
                            {quizType === "qna" && (
                              <div
                                className={`select ${
                                  optionsAgain.isCorrect
                                    ? "correctIndividualOption"
                                    : ""
                                }`}
                              ></div>
                            )}
                            <input
                              type="text"
                              onChange={(e) =>
                                handleOptionsValueURLChange(
                                  e.target.value,
                                  index
                                )
                              }
                              className={`${
                                optionsAgain.isCorrect && quizType === "qna"
                                  ? "correctIndividualOption"
                                  : ""
                              } only_one_input`}
                              value={optionsAgain.url}
                              placeholder="Image URL"
                            />
                            {index > 1 && (
                              <div
                                className="delete"
                                onClick={(e) => handleDeleteOption(e, index)}
                              >
                                <img
                                  src={DeleteIcon}
                                  alt="delete"
                                  style={{ height: "24px" }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                        {questionArray[questionIndex].optionType ===
                          "text and image" && (
                          <div
                            className="individualOptions flexCenter"
                            onClick={() => {
                              handleCorrectOption(index);
                            }}
                          >
                            {quizType === "qna" && (
                              <div
                                className={`select ${
                                  optionsAgain.isCorrect
                                    ? "correctIndividualOption"
                                    : ""
                                }`}
                              ></div>
                            )}
                            <input
                              type="text"
                              onChange={(e) =>
                                handleOptionsValueTextChange(
                                  e.target.value,
                                  index
                                )
                              }
                              className={`${
                                optionsAgain.isCorrect && quizType === "qna"
                                  ? "correctIndividualOption"
                                  : ""
                              } two_input_text`}
                              value={optionsAgain.text}
                              placeholder="Text"
                            />
                            <input
                              type="text"
                              onChange={(e) =>
                                handleOptionsValueURLChange(
                                  e.target.value,
                                  index
                                )
                              }
                              className={`${
                                optionsAgain.isCorrect && quizType === "qna"
                                  ? "correctIndividualOption"
                                  : ""
                              } two_input_url`}
                              value={optionsAgain.url}
                              placeholder="Image URL"
                            />
                            {index > 1 && (
                              <div
                                className="delete"
                                onClick={(e) => handleDeleteOption(e, index)}
                              >
                                <img
                                  src={DeleteIcon}
                                  alt="delete"
                                  style={{ height: "24px" }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    );
                  }
                )}
                {questionArray[questionIndex].options.length < 4 && (
                  <div className="addMoreOptions flexCenter">
                    <p onClick={handleAddNewOption}>Add option</p>
                  </div>
                )}
              </div>
              <div className="timer">
                <div>Timer</div>
                <div
                  className={`${
                    questionArray[questionIndex].timer === "off"
                      ? "timerSelect"
                      : ""
                  }`}
                  onClick={() => handleSetQuestionTimer("off")}
                >
                  OFF
                </div>
                <div
                  className={`${
                    questionArray[questionIndex].timer === "5"
                      ? "timerSelect"
                      : ""
                  }`}
                  onClick={() => handleSetQuestionTimer("5")}
                >
                  5 Sec
                </div>
                <div
                  className={`${
                    questionArray[questionIndex].timer === "10"
                      ? "timerSelect"
                      : ""
                  }`}
                  onClick={() => handleSetQuestionTimer("10")}
                >
                  10 Sec
                </div>
              </div>
            </div>
            <div className="questionInputAction flexCenter">
              <input
                type="reset"
                value="Cancel"
                onClick={() => {
                  setQuestionArray([{ ...QUESTION }]);
                  setOpen(false);
                }}
              />
              <input
                type="submit"
                value="Create Quiz"
                onClick={handleStep2Submit}
              />
            </div>
          </form>
        </div>
      )}
      {step === "step3" && (
        <div className="step3">
          <div
            className="close"
            onClick={() => {
              setStep("step1");
              setOpen(false);
              setDashboardTab(ANALYTICS);
              setQuizId0();
              navigate("/quizapp/dashboard/analytics");
            }}
          >
            <img src={CrossIcon} alt="close" style={{ height: "36px" }} />
          </div>
          <div className="heading">
            Congrats your Quiz is <br /> Published!
          </div>
          <div className="link">{copyText}</div>
          <div
            className="share"
            onClick={() => {
              handleCopyToClipboard();
            }}
          >
            Share
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuizContainer;

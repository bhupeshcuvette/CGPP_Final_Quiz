import { Link, Route, Routes, useNavigate } from "react-router-dom";
import "../styling/dashboardStyles.css";
import { createContext, useEffect, useState } from "react";
import { ANALYTICS, CREATE_QUIZ, DASHBOARD } from "../utils/constants";
import DashboardContent from "../pages/DashboardContent";
import AnalyticsContent from "../pages/AnalyticsContent";
import QuizAnalysisContainer from "./QuizAnalysisContainer";
import Modal from "../pages/Modal";
import CreateQuizContainer from "./CreateQuizContainer";
import { AnalyticsProvider } from "../context/analytics.context";

export const DashboardContext = createContext();

const DashboardContainer = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("jwt_auth_token");

    navigate("/");
  };

  const [dashboardTab, setDashboardTab] = useState(DASHBOARD);
  const [open, setOpen] = useState(false);
  const [quizId0, setQuizId0] = useState();

  useEffect(() => {
    if (open) return;

    const currentUrl = window.location.pathname;

    if (currentUrl.includes(ANALYTICS)) setDashboardTab(ANALYTICS);
    else setDashboardTab(DASHBOARD);
  }, [open]);

  return (
    <DashboardContext.Provider
      value={{
        open,
        setOpen,
        setDashboardTab,
        dashboardTab,
        quizId0,
        setQuizId0,
      }}
    >
      <AnalyticsProvider>
        <Modal open={open} onClose={() => setOpen(false)}>
          <CreateQuizContainer />
        </Modal>
        <div className="dashboard">
          <div className="navigation flexCenter">
            <div className="heading">QUIZZIE</div>
            <div className="navmenu">
              <Link
                className={`flexCenter custom-link ${
                  dashboardTab === DASHBOARD ? "active" : ""
                }`}
                to="/quizapp/dashboard"
                onClick={() => setDashboardTab(DASHBOARD)}
              >
                Dashboard
              </Link>
              <Link
                className={`flexCenter custom-link ${
                  dashboardTab === ANALYTICS ? "active" : ""
                }`}
                to="/quizapp/dashboard/analytics"
                onClick={() => setDashboardTab(ANALYTICS)}
              >
                Analytics
              </Link>
              <p
                className={`flexCenter custom-link ${
                  dashboardTab === CREATE_QUIZ ? "active" : ""
                }`}
                onClick={() => {
                  setDashboardTab(CREATE_QUIZ);
                  setOpen(true);
                }}
              >
                Create Quiz
              </p>
            </div>
            <div className="logout">
              <hr style={{ width: "100%" }} />
              <button onClick={logout}>Logout</button>
            </div>
          </div>
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="/analytics" element={<AnalyticsContent />} />
            <Route
              path="/analytics/quiz/:quizId"
              element={<QuizAnalysisContainer />}
            />
          </Routes>
        </div>
      </AnalyticsProvider>
    </DashboardContext.Provider>
  );
};

export default DashboardContainer;

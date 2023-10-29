import { createContext, useState } from "react";
import { LOGIN_TEXT, LOGIN, SIGNUP_TEXT, SIGNUP } from "../utils/constants";
import Conditional from "./Conditional";
import SignInPage from "../pages/SignIn";
import SignUpPage from "../pages/SignUp";

export const MainContainerContext = createContext();
const MainLayoutContainer = () => {
  const [tab, setTab] = useState(SIGNUP);

  return (
    <MainContainerContext.Provider value={{ setTab }}>
      <div className="quizContainer flexCenter">
        <div className="tabContainer flexCenter">
          <div className="title">QUIZZIE</div>
          <div className="header">
            <button
              className={tab === SIGNUP ? "focus" : ""}
              onClick={() => setTab(SIGNUP)}
            >
              {SIGNUP_TEXT}
            </button>
            <button
              className={tab === LOGIN ? "focus" : ""}
              onClick={() => setTab(LOGIN)}
            >
              {LOGIN_TEXT}
            </button>
          </div>
          <div className="form">
            <Conditional if={tab === LOGIN}>
              <SignInPage />
            </Conditional>
            <Conditional if={tab === SIGNUP}>
              <SignUpPage />
            </Conditional>
          </div>
        </div>
      </div>
    </MainContainerContext.Provider>
  );
};

export default MainLayoutContainer;

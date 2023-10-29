import { useContext, useState } from "react";
import {
  ERROR_INFO,
  LOGIN,
  SHOW_ERROR_INFO,
  SIGNUP_TEXT,
  USER_INFO,
} from "../utils/constants";
import { signUpUser } from "../services/authenticationService";
import "../styling/authenticationFormStyles.css";
import { toast } from "react-toastify";
import { validate } from "../utils/validation";
import { MainContainerContext } from "./MainLayoutContainer";

const SignUpContainer = () => {
  const [userInfo, setUserInfo] = useState({ ...USER_INFO });
  const [errorInfo, setErrorInfo] = useState({ ...ERROR_INFO });
  const [showErrorInfo, setShowErrorInfo] = useState({ ...SHOW_ERROR_INFO });
  const { setTab } = useContext(MainContainerContext);

  const setErrorInfoHandler = (type, value) => {
    setErrorInfo((prevErrorInfo) => ({
      ...prevErrorInfo,
      [type]: value,
    }));
    setShowErrorInfo((prevShowErrorInfo) => ({
      ...prevShowErrorInfo,
      [type]: true,
    }));
  };

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: value,
    }));
    setShowErrorInfo((prevShowErrorInfo) => ({
      ...prevShowErrorInfo,
      [name]: false,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const { isError, error } = validate(userInfo);

    let flag = false;

    if (isError) {
      if (error.name !== "") {
        setErrorInfoHandler("name", error.name);
        flag = true;
      }
      if (error.email !== "") {
        setErrorInfoHandler("email", error.email);
        flag = true;
      }
      if (error.password !== "") {
        setErrorInfoHandler("password", error.password);
        flag = true;
      }
      if (error.confirmPassword !== "") {
        setErrorInfoHandler("confirmPassword", error.confirmPassword);
        flag = true;
      }
      if (flag) return;
    }

    const response = await signUpUser({
      ...userInfo,
      email: userInfo?.email?.toLowerCase(), // convert email to lowercase before sending to server
    });

    if (!("error" in response)) {
      toast.success(response.message);
      setUserInfo(USER_INFO);
      setTab(LOGIN);
    }
  };

  return (
    <section className="signupForm">
      <form onSubmit={onSubmitHandler} className="flexCenter">
        <section className="formItem">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            onChange={onChangeHandler}
            value={showErrorInfo.name ? errorInfo.name : userInfo.name}
            className={showErrorInfo.name ? "error" : ""}
          />
        </section>
        <section className="formItem">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            name="email"
            onChange={onChangeHandler}
            value={showErrorInfo.email ? errorInfo.email : userInfo.email}
            className={showErrorInfo.email ? "error" : ""}
          />
        </section>
        <section className="formItem">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="text"
            name="password"
            onChange={onChangeHandler}
            value={
              showErrorInfo.password ? errorInfo.password : userInfo.password
            }
            className={showErrorInfo.password ? "error" : ""}
          />
        </section>
        <section className="formItem">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="text"
            name="confirmPassword"
            onChange={onChangeHandler}
            value={
              showErrorInfo.confirmPassword
                ? errorInfo.confirmPassword
                : userInfo.confirmPassword
            }
            className={showErrorInfo.confirmPassword ? "error" : ""}
          />
        </section>
        <input type="submit" className="submitButton" value={SIGNUP_TEXT} />
      </form>
    </section>
  );
};

export default SignUpContainer;

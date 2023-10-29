import { useState } from "react";
import { LOGIN_TEXT, USER_INFO } from "../utils/constants";
import { signInUser } from "../services/authenticationService";
import { toast } from "react-toastify";

const SignInContainer = () => {
  const [userInfo, setUserInfo] = useState({ ...USER_INFO });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const response = await signInUser({
      ...userInfo,
      email: userInfo.email.toLowerCase(),
    });

    if (!("error" in response)) {
      localStorage.setItem("jwt_auth_token", response.token);
      setUserInfo(USER_INFO);

      toast.success("User logged in successfully");
      window.location.href = "/quizapp/dashboard";
    }
  };

  return (
    <section className="loginForm">
      <form onSubmit={onSubmitHandler} className="flexCenter">
        <section className="formItem">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            name="email"
            onChange={onChangeHandler}
            value={userInfo.email}
          />
        </section>
        <section className="formItem">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            onChange={onChangeHandler}
            value={userInfo.password}
          />
        </section>
        <input type="submit" className="submitButton" value={LOGIN_TEXT} />
      </form>
    </section>
  );
};

export default SignInContainer;

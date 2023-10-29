import { Route, Routes, useNavigate } from "react-router-dom";
import DashboardPage from "./Dashboard";
import { useEffect } from "react";

const AuthenticatedRoutesPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("jwt_auth_token")) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Routes>
      <Route path="/dashboard/*" element={<DashboardPage />} />
    </Routes>
  );
};

export default AuthenticatedRoutesPage;

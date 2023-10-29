import "./App.css";
import MainLayoutPage from "./pages/MainLayout";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthenticatedRoutesPage from "./pages/AuthenticatedRoutes";
import Quiz from "./containers/Quiz";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainLayoutPage />} />
        <Route path="/quizapp/*" element={<AuthenticatedRoutesPage />} />
        <Route path="/quiz/:quizId" element={<Quiz />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
      />
    </div>
  );
}

export default App;

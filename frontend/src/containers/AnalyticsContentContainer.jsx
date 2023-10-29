import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "../styling/analyticsContentStyles.css";
import { formatDateToCustomString } from "../utils/validation";
import { deleteQuiz } from "../services/quizServices";
import { toast } from "react-toastify";
import { DashboardContext } from "./DashboardContainer";
import Modal from "../pages/Modal";
import { useAnalytics } from "../context/analytics.context";
import DeleteIcon from "../assets/images/delete.png";
import EditIcon from "../assets/images/edit.png";
import ShareIcon from "../assets/images/share.png";

function DeleteQuizModal(props) {
  const { open, onClose, quizId } = props;
  const { setAnalytics } = useAnalytics();

  const handleQuizDelete = async (id) => {
    const response = await deleteQuiz(id);
    if ("error" in response) {
      toast.error("Please try again!");
      return;
    }
    toast.success("Quiz Deleted Successfully");
    setAnalytics();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="deleteQuizModal">
        <div className="heading">Are you confirm you want to delete ?</div>
        <div className="buttons">
          <button
            className="delete_btn"
            onClick={() => handleQuizDelete(quizId)}
          >
            Confirm Delete
          </button>
          <button className="cancel_btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

function QuizAnalysisItem(props) {
  const { index, quiz } = props;
  const { setQuizId0, setOpen } = useContext(DashboardContext);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleCopyToClipboard = (id) => {
    const textToCopy = window.location.origin + "/quiz/" + id;
    const tempInput = document.createElement("input");
    tempInput.value = textToCopy;

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

  return (
    <tr>
      <DeleteQuizModal
        open={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
        }}
        quizId={quiz.quizId}
      />
      <td style={{ textAlign: "center" }}>{index + 1}</td>
      <td style={{ textAlign: "center" }}>{quiz.quizName}</td>
      <td>{formatDateToCustomString(quiz.createdAt)}</td>
      <td style={{ textAlign: "center" }}>{quiz.participants.length}</td>
      <td>
        <span
          style={{ cursor: "pointer", marginRight: "12px" }}
          onClick={() => {
            setQuizId0(quiz.quizId);
            setOpen(true);
          }}
        >
          <img src={EditIcon} alt="delete" style={{ height: "24px" }} />
        </span>
        <span
          style={{ cursor: "pointer", marginRight: "12px" }}
          onClick={(e) => {
            e.stopPropagation();
            setOpenDeleteModal(true);
          }}
        >
          <img src={DeleteIcon} alt="delete" style={{ height: "24px" }} />
        </span>
        <span
          style={{ cursor: "pointer" }}
          onClick={() => handleCopyToClipboard(quiz.quizId)}
        >
          <img src={ShareIcon} alt="delete" style={{ height: "24px" }} />
        </span>
      </td>
      <td>
        <Link to={`/quizapp/dashboard/analytics/quiz/${quiz.quizId}`}>
          Questions wise analysis
        </Link>
      </td>
    </tr>
  );
}

function AnalyticsContentContainer() {
  const { analyticsData } = useAnalytics();

  return (
    <div className="analyticsContent flexCenter">
      <div className="heading">Quiz Analysis</div>
      <div className="quizRows">
        <table>
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>S.No</th>
              <th style={{ textAlign: "center" }}>Quiz Name</th>
              <th>Created On</th>
              <th style={{ textAlign: "center" }}>Impressions</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {analyticsData?.data?.map((quiz, index) => {
              return (
                <QuizAnalysisItem
                  key={quiz.quizName}
                  index={index}
                  quiz={quiz}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AnalyticsContentContainer;

import "../styling/dashboardContentStyles.css";
import { formatDateToCustomString } from "../utils/validation";
import { useAnalytics } from "../context/analytics.context";
import ViewsIcon from "../assets/images/views.png";

const DashboardContentContainer = () => {
  const { analyticsData } = useAnalytics();

  return (
    <div className="summaryContent">
      <div className="statistics flexCenter">
        <section>
          <div className="heading">
            <span className="count">{analyticsData?.totalQuizzes ?? 0}</span>
            <span className="quiz">Quiz</span>
          </div>
          <div className="paragraph">Created</div>
        </section>
        <section>
          <div className="heading">
            <span className="count">{analyticsData?.totalQuestions ?? 0}</span>
            <span className="questions">Questions</span>
          </div>
          <div className="paragraph">Created</div>
        </section>
        <section>
          <div className="heading">
            <span className="count">
              {analyticsData?.totalImpressions ?? 0}
            </span>
            <span className="quiz">Total</span>
          </div>
          <div className="paragraph">Impressions</div>
        </section>
      </div>
      <div className="trendingQuizList">
        <div className="heading">Trending Quizzes</div>
        <div className="quizList">
          {analyticsData?.data
            ?.filter((quiz) => quiz?.impression > 10)
            .map((quiz) => {
              return (
                <div className="quizItem" key={quiz.quizName}>
                  <div className="heading">
                    <p className="quiz_name">{quiz.quizName}</p>
                    <p className="views">
                      {quiz.participants.length}
                      <img
                        src={ViewsIcon}
                        alt="views"
                        style={{ height: "18px" }}
                      />
                    </p>
                  </div>
                  <div className="date">
                    {formatDateToCustomString(quiz.createdAt)}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default DashboardContentContainer;

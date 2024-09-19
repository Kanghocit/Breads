import SurveyOption from "./option";
import "./index.css";

const Survey = ({ post }) => {
  const surveyOptions = post.survey;

  return (
    <div className="survey-container">
      {surveyOptions.map((option) => (
        <div key={`option-${option.value}`}>
          <SurveyOption option={option} post={post} />
        </div>
      ))}
    </div>
  );
};

export default Survey;

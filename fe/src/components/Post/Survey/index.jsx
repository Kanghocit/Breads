import SurveyOption from "./option";
import "./index.css";

const Survey = ({ post }) => {
  const surveyOptions = post.survey;

  return (
    <div className="survey-container">
      {surveyOptions.map((option, index) => (
        <div key={`${post._id}-option-${option.value}-${index}`}>
          <SurveyOption option={option} post={post} />
        </div>
      ))}
    </div>
  );
};

export default Survey;

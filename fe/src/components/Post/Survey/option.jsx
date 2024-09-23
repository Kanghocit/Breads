import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSurveyOption } from "../../../store/PostSlice/asyncThunk";
import "./index.css";

const SurveyOption = ({ option, post }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const handleTickOption = () => {
    dispatch(
      selectSurveyOption({
        optionId: option._id,
        userId: userInfo._id,
        isAdd: !option.usersId.includes(userInfo._id),
        postId: post._id,
      })
    );
  };
  const percent = useMemo(() => {
    const total = post.survey.reduce(
      (count, option) => count + option.usersId.length,
      0
    );
    if (total === 0) {
      return 0;
    }
    return Math.floor((option.usersId.length / total) * 100);
  }, [post]);

  return (
    <div className="survey-opt">
      <p className="value">{option.value}</p>
      <div className="action-wrapper">
        <p className="percent">{percent}%</p>
        <input
          type="checkbox"
          onChange={() => handleTickOption()}
          checked={option.usersId.includes(userInfo._id)}
        />
      </div>
      <div
        className="opt-bg"
        style={{
          width: `${percent}%`,
          transition: "width 0.5s ease-in-out",
        }}
      ></div>
    </div>
  );
};

export default SurveyOption;

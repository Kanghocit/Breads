import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSurveyOption } from "../../../../store/PostSlice/asyncThunk";
import "./index.css";
import { isAdminPage } from "../../../../util";

const SurveyOption = ({ option, post, isParentPost = false }) => {
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
      (count, option) => count + option.usersId?.length,
      0
    );
    if (total === 0) {
      return 0;
    }
    return Math.floor((option.usersId?.length / total) * 100);
  }, [post]);

  console.log("isAdminPage: ", isAdminPage);

  return (
    <div className="survey-opt">
      <p
        className="value"
        style={
          isAdminPage
            ? {
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                flexGrow: 1,
              }
            : {}
        }
      >
        {option.value}
      </p>
      {!isAdminPage && (
        <div className="action-wrapper">
          <p className="percent">{percent}%</p>
          <input
            type="checkbox"
            onChange={() => {
              if (!isParentPost && !isAdminPage) {
                handleTickOption();
              }
            }}
            checked={option.usersId?.includes(userInfo._id)}
          />
        </div>
      )}
      <div
        className="opt-bg"
        style={{
          width: `${percent}%`,
          transition: "width 0.5s ease-in-out",
        }}
      />
    </div>
  );
};

export default SurveyOption;

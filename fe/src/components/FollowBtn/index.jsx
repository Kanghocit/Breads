import { Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import useShowToast from "../../hooks/useShowToast";
import { followUser } from "../../store/UserSlice/asyncThunk";

export const handleFlow = async (userInfo, user, dispatch, showToast) => {
  if (!userInfo?._id) {
    showToast("Error", "Please login to follow", "error");
    return;
  }
  dispatch(
    followUser({
      userFlId: user._id,
      userId: userInfo._id,
    })
  );
  try {
  } catch (error) {
    showToast("Error", error, "error");
  }
};

const FollowBtn = ({ user }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const isFollowing = userInfo?.following?.includes(user?._id);
  const showToast = useShowToast();

  return (
    <Button
      size={"md"}
      onClick={() => handleFlow(userInfo, user, dispatch, showToast)}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowBtn;

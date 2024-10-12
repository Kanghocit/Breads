import { Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import useShowToast from "../../hooks/useShowToast";
import { followUser } from "../../store/UserSlice/asyncThunk";
import { useState } from "react";
import UnFollowPopup from "./UnfollowPopup";

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
  const [openCancelPopup, setOpenCancelPopup] = useState(false);

  return (
    <>
      <Button
        size={"md"}
        onClick={() => {
          if (isFollowing) {
            setOpenCancelPopup(true);
          } else {
            handleFlow(userInfo, user, dispatch, showToast);
          }
        }}
      >
        {isFollowing
          ? "Unfollow"
          : userInfo.followed?.includes(user._id)
          ? "Follow Back"
          : "Follow"}
      </Button>
      <UnFollowPopup
        user={user}
        isOpen={openCancelPopup}
        onClose={() => setOpenCancelPopup(false)}
        onClick={() => {
          handleFlow(userInfo, user, dispatch, showToast);
          setOpenCancelPopup(false);
        }}
      />
    </>
  );
};

export default FollowBtn;

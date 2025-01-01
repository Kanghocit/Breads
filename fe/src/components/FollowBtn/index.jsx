import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NOTIFICATION_PATH, Route } from "../../Breads-Shared/APIConfig";
import { Constants } from "../../Breads-Shared/Constants";
import PageConstant from "../../Breads-Shared/Constants/PageConstants";
import useShowToast from "../../hooks/useShowToast";
import Socket from "../../socket";
import { followUser } from "../../store/UserSlice/asyncThunk";
import UnFollowPopup from "./UnfollowPopup";
import { addEvent } from "../../util";

export const handleFlow = async (userInfo, user, dispatch, showToast) => {
  if (!userInfo?._id) {
    showToast("Error", t("logintofollow"), "error");
    return;
  }
  dispatch(
    followUser({
      userFlId: user._id,
      userId: userInfo._id,
    })
  );
  try {
    const socket = Socket.getInstant();
    socket.emit(Route.NOTIFICATION + NOTIFICATION_PATH.CREATE, {
      fromUser: userInfo._id,
      toUsers: [user._id],
      action: Constants.NOTIFICATION_ACTION.FOLLOW,
      target: "",
    });
  } catch (error) {
    showToast("Error", error, "error");
  }
};

const FollowBtn = ({ user, inUserFlBox = false }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const currentPage = useSelector((state) => state.util.currentPage);
  const isFollowing = userInfo?.following?.includes(user?._id);
  const showToast = useShowToast();
  const [openCancelPopup, setOpenCancelPopup] = useState(false);

  return (
    <div
      style={{
        flex: currentPage === PageConstant.FRIEND && !inUserFlBox ? 1 : "",
      }}
    >
      <Button
        width={
          currentPage === PageConstant.FRIEND && !inUserFlBox ? "100%" : ""
        }
        size={"md"}
        onClick={() => {
          if (isFollowing) {
            setOpenCancelPopup(true);
          } else {
            addEvent({
              event: "follow_user",
              payload: {
                userId: user._id,
              },
            });
            handleFlow(userInfo, user, dispatch, showToast);
          }
        }}
      >
        {isFollowing
          ? t("unfollow")
          : userInfo.followed?.includes(user?._id)
          ? t("followback")
          : t("follow")}
      </Button>
      <UnFollowPopup
        user={user}
        isOpen={openCancelPopup}
        onClose={() => setOpenCancelPopup(false)}
        onClick={(e) => {
          e.stopPropagation();
          addEvent({
            event: "unfollow_user",
            payload: {
              userId: user._id,
            },
          });
          handleFlow(userInfo, user, dispatch, showToast);
          setOpenCancelPopup(false);
        }}
      />
    </div>
  );
};

export default FollowBtn;

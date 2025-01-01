import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import Activity from "../components/Activity";
import ContainerLayout from "../components/MainBoxLayout";
import { getNotificattions } from "../store/NotificationSlice/asyncThunk";
import { changePage } from "../store/UtilSlice/asyncThunk";
import { addEvent } from "../util";

const ActivityPage = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const { currentPage, displayPageData } = useSelector((state) => state.util);
  const notifications = useSelector(
    (state) => state.notification.notifications
  );
  useEffect(() => {
    dispatch(
      changePage({
        nextPage: PageConstant.ACTIVITY,
        currentPage: currentPage,
      })
    );
    if (userInfo?._id) {
      dispatch(
        getNotificattions({
          userId: userInfo?._id,
          page: 1,
          limit: 15,
        })
      );
      addEvent({
        event: "see_page",
        payload: {
          page: "activity",
        },
      });
    }
  }, [userInfo]);

  return (
    <>
      <ContainerLayout>
        <Activity currentPage={displayPageData} />
      </ContainerLayout>
    </>
  );
};

export default ActivityPage;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NOTIFICATION_PATH } from "../Breads-Shared/APIConfig";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import CreatePostBar from "../components/CreatePostBar";
import ListPost from "../components/ListPost";
import ContainerLayout from "../components/MainBoxLayout";
import useSocket from "../hooks/useSocket";
import { getPosts } from "../store/PostSlice/asyncThunk";
import { changeDisplayPageData } from "../store/UtilSlice";
import { changePage } from "../store/UtilSlice/asyncThunk";

const HomePage = () => {
  const dispatch = useDispatch();
  const { currentPage, displayPageData } = useSelector((state) => state.util);
  const { FOR_YOU } = PageConstant;

  useEffect(() => {
    dispatch(changePage({ nextPage: PageConstant.HOME, currentPage }));
    handleGetDataByPage();
  }, []);

  useEffect(() => {
    if (currentPage === PageConstant.HOME) {
      dispatch(
        getPosts({
          filter: { page: displayPageData },
          userId: localStorage.getItem("userId"),
          isNewPage: true,
        })
      );
    }
  }, [displayPageData, currentPage]);

  useSocket((socket) => {
    socket.on(NOTIFICATION_PATH.GET, (payload) => {});
  }, []);

  const handleGetDataByPage = () => {
    let pathname = window.location.pathname;
    pathname = pathname.slice(1, pathname.length);
    let result = "";
    if (!pathname) {
      result = FOR_YOU;
    } else {
      result = pathname;
    }
    if (result) {
      dispatch(changeDisplayPageData(result));
    }
  };

  return (
    <ContainerLayout>
      <>
        {displayPageData === FOR_YOU && <CreatePostBar />
        }
        <ListPost />
      </>
    </ContainerLayout>
  );
};

export default HomePage;

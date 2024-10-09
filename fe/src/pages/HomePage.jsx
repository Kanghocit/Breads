import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import CreatePostBar from "../components/CreatePostBar";
import ListPost from "../components/ListPost";
import ContainerLayout from "../components/MainBoxLayout";
import { getPosts } from "../store/PostSlice/asyncThunk";
import { changeDisplayPageData, changePage } from "../store/UtilSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const { currentPage, displayPageData } = useSelector((state) => state.util);
  const initPage = useRef(true);
  const { FOR_YOU } = PageConstant;

  useEffect(() => {
    dispatch(changePage({ nextPage: PageConstant.HOME, currentPage }));
    handleGetDataByPage();
  }, []);

  useEffect(() => {
    if (currentPage === PageConstant.HOME) {
      console.log("displayPageData: ", displayPageData);
      dispatch(
        getPosts({
          filter: displayPageData,
          userId: localStorage.getItem("userId"),
          isNewPage: true,
        })
      );
    }
  }, [displayPageData, currentPage]);

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
        {displayPageData === FOR_YOU && <CreatePostBar />}
        <ListPost />
      </>
    </ContainerLayout>
  );
};

export default HomePage;

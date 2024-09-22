import { Fragment, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageConstant from "../../../share/Constants/PageConstants";
import ContainerLayout from "../components/MainBoxLayout";
import Post from "../components/Post";
import { getPosts } from "../store/PostSlice/asyncThunk";
import { changeDisplayPageData, changePage } from "../store/UtilSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const { currentPage, displayPageData } = useSelector((state) => state.util);
  const listPost = useSelector((state) => state.post.listPost);
  const initPage = useRef(true);

  useEffect(() => {
    if (!initPage.current) {
      dispatch(
        getPosts({
          filter: displayPageData,
          userId: localStorage.getItem("userId"),
        })
      );
    }
  }, [displayPageData]);

  useEffect(() => {
    dispatch(changePage({ nextPage: PageConstant.HOME, currentPage }));
    handleGetDataByPage();
    initPage.current = false;
  }, []);

  const handleGetDataByPage = () => {
    const { FOR_YOU } = PageConstant;
    let pathname = window.location.pathname;
    pathname = pathname.slice(1, pathname.length);
    let result = "";
    if (!pathname) {
      result = FOR_YOU;
    } else {
      result = pathname;
    }
    dispatch(
      getPosts({ filter: result, userId: localStorage.getItem("userId") })
    );
  };

  return (
    <ContainerLayout>
      {
        <>
          {listPost?.map((post) => (
            <Fragment key={post?._id}>
              <Post post={post} />
              <hr
                style={{
                  height: "4px",
                }}
              />
            </Fragment>
          ))}
        </>
      }
    </ContainerLayout>
  );
};

export default HomePage;

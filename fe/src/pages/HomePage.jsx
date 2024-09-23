import { Fragment, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageConstant from "../../../share/Constants/PageConstants";
import ContainerLayout from "../components/MainBoxLayout";
import Post from "../components/Post";
import { getPosts } from "../store/PostSlice/asyncThunk";
import { changeDisplayPageData, changePage } from "../store/UtilSlice";
import SkeletonPost from "../components/Post/skeleton";
import { EmptyContentSvg } from "../assests/icons";
import { Flex } from "@chakra-ui/react";

const HomePage = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const { currentPage, displayPageData } = useSelector((state) => state.util);
  const { listPost, isLoading } = useSelector((state) => state.post);
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
    if (result) {
      dispatch(changeDisplayPageData(result));
      dispatch(
        getPosts({ filter: result, userId: localStorage.getItem("userId") })
      );
    }
  };

  return (
    <ContainerLayout>
      <>
        {listPost?.length !== 0 && !isLoading ? (
          <>
            {listPost?.map((post) => (
              <Fragment key={post?._id}>
                <Post post={post} />
                <hr
                  style={{
                    height: "12px",
                  }}
                />
              </Fragment>
            ))}
          </>
        ) : (
          <>
            {isLoading ? (
              <>
                <Flex
                  gap={"12px"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SkeletonPost key={`skeleton-post-${num}`} />
                  ))}
                </Flex>
              </>
            ) : (
              <Flex justifyContent={"center"} alignItems={"center"}>
                <EmptyContentSvg />
              </Flex>
            )}
          </>
        )}
      </>
    </ContainerLayout>
  );
};

export default HomePage;

import { Flex } from "@chakra-ui/react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EmptyContentSvg } from "../../assests/icons";
import { getPosts } from "../../store/PostSlice/asyncThunk";
import Post from "./Post";
import SkeletonPost from "./Post/skeleton";
import PageConstant from "../../../../share/Constants/PageConstants";

const ListPost = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const { listPost, isLoading } = useSelector((state) => state.post);
  const { currentPage, displayPageData } = useSelector((state) => state.util);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    if (userInfo._id) {
      handleGetPosts();
    }
  }, [userInfo._id, page, currentPage]);

  useEffect(() => {
    setPage(1);
  }, [displayPageData]);

  const handleGetPosts = async () => {
    try {
      console.log("displayPageData: ", displayPageData);
      setLoading(true);
      if (currentPage === PageConstant.USER) {
      } else {
        dispatch(
          getPosts({
            filter: displayPageData,
            userId: userInfo?._id,
            page: page,
          })
        );
      }
    } catch (err) {
      console.error("Error scroll to get more post: ", err);
    } finally {
      setLoading(false);
    }
  };

  const lastEle = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <>
      {listPost?.length !== 0 ? (
        <>
          {listPost?.map((post, index) => {
            if (index + 1 === listPost?.length) {
              return (
                <>
                  <div key={post?._id} ref={lastEle}>
                    <Post post={post} ref={lastEle} />
                    <hr
                      style={{
                        height: "12px",
                      }}
                    />
                  </div>
                  {isLoading && (
                    <Flex
                      gap={"12px"}
                      flexDirection={"column"}
                      justifyContent={"center"}
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SkeletonPost key={`skeleton-post-${num}`} />
                      ))}
                    </Flex>
                  )}
                </>
              );
            } else {
              return (
                <Fragment key={post?._id}>
                  <Post post={post} />
                  <hr
                    style={{
                      height: "12px",
                    }}
                  />
                </Fragment>
              );
            }
          })}
        </>
      ) : (
        <>
          {isLoading ? (
            <Flex
              gap={"12px"}
              flexDirection={"column"}
              justifyContent={"center"}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <SkeletonPost key={`skeleton-post-${num}`} />
              ))}
            </Flex>
          ) : (
            <Flex justifyContent={"center"} alignItems={"center"}>
              <EmptyContentSvg />
            </Flex>
          )}
        </>
      )}
    </>
  );
};

export default ListPost;

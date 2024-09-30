import { Flex } from "@chakra-ui/react";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { EmptyContentSvg } from "../assests/icons";
import ContainerLayout from "../components/MainBoxLayout";
import Post from "../components/Post";
import SkeletonPost from "../components/Post/skeleton";
import UserHeader from "../components/UserHeader";
import { getUserPosts } from "../store/PostSlice/asyncThunk";
import { getUserInfo } from "../store/UserSlice/asyncThunk";

const UserPage = () => {
  const dispatch = useDispatch();
  const userSelected = useSelector((state) => state.user.userSelected);
  const { listPost, isLoading } = useSelector((state) => state.post);
  const { userId } = useParams();

  useEffect(() => {
    const localUserId = localStorage.getItem("userId");
    if (userId && userId !== localUserId) {
      dispatch(getUserInfo({ userId }));
    }
    dispatch(getUserPosts(userId));
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <ContainerLayout>
        <UserHeader user={userSelected} />
        <div
          style={{
            marginTop: "24px",
          }}
        >
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
        </div>
      </ContainerLayout>
    </>
  );
};

export default UserPage;

import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { getUserInfo } from "../store/UserSlice/asyncThunk";
import ContainerLayout from "../components/MainBoxLayout";
import Post from "../components/Post/index";
import { getPosts } from "../store/PostSlice/asyncThunk";

const UserPage = () => {
  const dispatch = useDispatch();
  const { userInfo, isLoading } = useSelector((state) => state.user);
  const { userId } = useParams();
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [posts, setPosts] = useState();

  useEffect(() => {
   
    const localUserId = localStorage.getItem("userId");
    if (userId && userId !== localUserId) {
      dispatch(getUserInfo({ userId }));
    }
  }, [dispatch, userId]);

  if (isLoading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  //Create a new page
  // if (!userInfo._id && !loading) return <h1>User not found</h1>;

  return (
    <>
      <ContainerLayout>
        <UserHeader user={userInfo} />
        {fetchingPosts && (
          <Flex justifyContent={"center"} my={12}>
            <Spinner size={"xl"} />
          </Flex>
        )}
        {!fetchingPosts && posts.length === 0 && <h1>User has not posts.</h1>}
       
      </ContainerLayout>
    </>
  );
};

export default UserPage;

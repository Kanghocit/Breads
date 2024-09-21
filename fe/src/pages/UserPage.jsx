import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { getUserInfo } from "../store/UserSlice/asyncThunk";
import ContainerLayout from "../components/MainBoxLayout";

const UserPage = () => {
  const dispatch = useDispatch();
  const { userInfo, isLoading } = useSelector((state) => state.user);
  const { userId } = useParams();

  useEffect(() => {
    const localUserId = localStorage.getItem("userId");
    if (userId && userId !== localUserId) {
      dispatch(getUserInfo({ userId }));
    }
  }, []);

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
        <UserPost
          likes={1200}
          replies={481}
          postImg={"/post1.png"}
          postTitle={"Post1"}
        />
        <UserPost
          likes={450}
          replies={81}
          postImg={"/post2.png"}
          postTitle={"Post2"}
        />
        <UserPost
          likes={123}
          replies={41}
          postImg={"/post3.png"}
          postTitle={"Post3"}
        />
        <UserPost likes={150} replies={48} postTitle={"Post4"} />
      </ContainerLayout>
    </>
  );
};

export default UserPage;

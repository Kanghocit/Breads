import { Flex, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import useShowToast from "../hooks/useShowToast";

const UserPage = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const { username } = useParams();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   const getUser = async () => {
  //     try {
  //       const res = await fetch(`/api/users/profile/${username}`);
  //       const data = await res.json();
  //       if (data.error) {
  //         showToast("Error", data.error, "error");
  //         return
  //       }
  //       setUser(data);
  //     } catch (error) {
  //       showToast("Error", error, "error")
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   getUser();
  // }, [username, showToast]);

  if (!userInfo._id && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!userInfo._id && !loading) return <h1>User not found</h1>;

  return (
    <>
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
    </>
  );
};

export default UserPage;

import { Container, Flex } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import Post from "../components/Post";
import SkeletonPost from "../components/Post/skeleton";
import ContainerLayout from "../components/ContainerLayout";

const HomePage = () => {
  const userInfo = useSelector((state) => state.user.userInfo);

  return (
    <ContainerLayout>
      {
        <>
          <Post />
          <SkeletonPost />
        </>
      }
    </ContainerLayout>
  );
};

export default HomePage;

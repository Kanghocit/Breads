import { Container, Flex } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import Post from "../components/Post";
import SkeletonPost from "../components/Post/skeleton";
import ContainerLayout from "../components/MainBoxLayout";
import { useEffect } from "react";
import { changePage } from "../store/UtilSlice";
import PageConstant from "../util/PageConstants";

const HomePage = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const currentPage = useSelector((state) => state.util.currentPage);

  useEffect(() => {
    dispatch(changePage({ nextPage: PageConstant.HOME, currentPage }));
  }, []);

  return (
    <ContainerLayout>
      {
        <>
          <Post />
          <Post />
          <SkeletonPost />
        </>
      }
    </ContainerLayout>
  );
};

export default HomePage;

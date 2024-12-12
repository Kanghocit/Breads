import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../../../store/PostSlice/asyncThunk";
import ListPost from "../../../ListPost";
import { containerBoxWidth } from "../../../MainBoxLayout";
import { filterPostWidth } from "../PostsFilterBar";

const PostsValidationData = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const currentPage = useSelector((state) => state.util.currentPage);

  useEffect(() => {
    if (userInfo?._id) {
      dispatch(
        getPosts({
          filter: { page: currentPage },
          userId: localStorage.getItem("userId"),
          isNewPage: true,
        })
      );
    }
  }, [userInfo?._id]);

  return (
    <Flex
      ml={`${filterPostWidth}px`}
      justifyContent={"center"}
      width={"100%"}
      height={"fit-content"}
      minHeight={"100vh"}
      py={8}
    >
      <Flex width={containerBoxWidth} flexDir={"column"} m={0}>
        <ListPost />
      </Flex>
    </Flex>
  );
};

export default PostsValidationData;

import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import PageConstant from "../../Breads-Shared/Constants/PageConstants";
import PostsFilterBar from "../../components/Admin/PostsValidation/PostsFilterBar";
import PostsValidationData from "../../components/Admin/PostsValidation/PostsValidationData";
import { changePage } from "../../store/UtilSlice/asyncThunk";
import { changeDisplayPageData } from "../../store/UtilSlice";

const PostsValidationPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changePage({ nextPage: PageConstant.ADMIN.POSTS_VALIDATION }));
    dispatch(changeDisplayPageData(PageConstant.ADMIN.POSTS_VALIDATION));
  }, []);

  return (
    <Flex width={"100%"} height={"fit-content"} minH={"100vh"}>
      <PostsFilterBar />
      <PostsValidationData />
    </Flex>
  );
};

export default PostsValidationPage;

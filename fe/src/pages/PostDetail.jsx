import { Flex } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Constants } from "../Breads-Shared/Constants";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import { EmptyContentSvg } from "../assests/icons";
import Post from "../components/ListPost/Post";
import ContainerLayout from "../components/MainBoxLayout";
import { getPost } from "../store/PostSlice/asyncThunk";
import { changePage } from "../store/UtilSlice/asyncThunk";
import { addEvent } from "../util";

const PostDetail = () => {
  const dispatch = useDispatch();
  const postId = window.location.pathname.split("/")?.[2];
  const userInfo = useSelector((state) => state.user.userInfo);
  const postSelected = useSelector((state) => state.post.postSelected);
  const currentPage = useSelector((state) => state.util.currentPage);

  useEffect(() => {
    if (postId) {
      dispatch(changePage({ currentPage, nextPage: PageConstant.POST_DETAIL }));
      dispatch(getPost(postId));
      addEvent({
        event: "see_detail_post",
        payload: {
          postId: postId,
        },
      });
    }
  }, []);

  const getContentRender = useMemo(() => {
    const postStatus = postSelected?.status;
    const { PENDING, PUBLIC, ONLY_ME, ONLY_FOLLOWERS, DELETED } =
      Constants.POST_STATUS;
    let ableToDisplayPost = userInfo?._id;

    switch (postStatus) {
      case PENDING:
      case DELETED:
        ableToDisplayPost = false;
        break;
      case ONLY_ME:
        ableToDisplayPost = userInfo?._id === postSelected?.authorId;
        break;
      case ONLY_FOLLOWERS:
        const followers = userInfo?.followed;
        ableToDisplayPost = !!followers?.length
          ? [...followers, userInfo?._id]?.includes(userInfo?._id)
          : false;
        break;
      default:
        ableToDisplayPost = !!userInfo?._id;
    }
    if (ableToDisplayPost) {
      return (
        <ContainerLayout>
          {postSelected?._id && <Post post={postSelected} isDetail={true} />}
        </ContainerLayout>
      );
    }
    return (
      <Flex justifyContent={"center"} alignItems={"center"}>
        <EmptyContentSvg />
      </Flex>
    );
  }, [postSelected?._id, userInfo?._id]);

  return <>{getContentRender}</>;
};

export default PostDetail;

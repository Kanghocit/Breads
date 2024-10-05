import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageConstant from "../../../share/Constants/PageConstants";
import ContainerLayout from "../components/MainBoxLayout";
import Post from "../components/ListPost/Post";
import { getPost } from "../store/PostSlice/asyncThunk";
import { changePage } from "../store/UtilSlice";

const PostDetail = () => {
  const dispatch = useDispatch();
  const postId = window.location.pathname.split("/")?.[2];
  const postSelected = useSelector((state) => state.post.postSelected);
  const currentPage = useSelector((state) => state.util.currentPage);

  useEffect(() => {
    if (postId) {
      dispatch(changePage({ currentPage, nextPage: PageConstant.POST_DETAIL }));
      dispatch(getPost(postId));
    }
  }, []);

  return (
    <ContainerLayout>
      {postSelected?._id && <Post post={postSelected} isDetail={true} />}
    </ContainerLayout>
  );
};

export default PostDetail;

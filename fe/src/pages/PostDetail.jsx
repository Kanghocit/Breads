import { useEffect } from "react";
import ContainerLayout from "../components/MainBoxLayout";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { getPost } from "../store/PostSlice/asyncThunk";

const PostDetail = () => {
  const dispatch = useDispatch();
  const postId = window.location.pathname.split("/")?.[2];
  const postSelected = useSelector((state) => state.post.postSelected);

  useEffect(() => {
    if (postId) {
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

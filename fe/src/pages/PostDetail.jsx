import ContainerLayout from "../components/MainBoxLayout";
import Post from "../components/Post";

const PostDetail = () => {
  return (
    <ContainerLayout>
      <Post isDetail={true} />
    </ContainerLayout>
  );
};

export default PostDetail;

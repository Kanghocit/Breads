import ContainerLayout from "../components/ContainerLayout";
import Post from "../components/Post";

const PostDetail = () => {
  return (
    <ContainerLayout>
      <Post isDetail={true} />
    </ContainerLayout>
  );
};

export default PostDetail;

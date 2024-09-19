import { Container, Flex } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import Post from "../components/Post";
import SkeletonPost from "../components/Post/skeleton";
import ContainerLayout from "../components/MainBoxLayout";
import { Fragment, useEffect } from "react";
import { changePage } from "../store/UtilSlice";
import PageConstant from "../util/PageConstants";
import { getPosts } from "../store/PostSlice/asyncThunk";

const HomePage = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const currentPage = useSelector((state) => state.util.currentPage);
  const listPost = useSelector((state) => state.post.listPost);

  useEffect(() => {
    dispatch(changePage({ nextPage: PageConstant.HOME, currentPage }));
    dispatch(getPosts());
  }, []);

  return (
    <ContainerLayout>
      {
        <>
          {listPost?.map((post) => (
            <Fragment key={post?._id}>
              <Post post={post} />
              <hr
                style={{
                  height: "4px",
                }}
              />
            </Fragment>
          ))}
        </>
      }
    </ContainerLayout>
  );
};

export default HomePage;

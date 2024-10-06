import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import ListPost from "../components/ListPost";
import ContainerLayout from "../components/MainBoxLayout";
import UserHeader from "../components/UserHeader";
import { getPosts, getUserPosts } from "../store/PostSlice/asyncThunk";
import { getUserInfo } from "../store/UserSlice/asyncThunk";
import { changePage } from "../store/UtilSlice";

const UserPage = () => {
  const dispatch = useDispatch();
  const userSelected = useSelector((state) => state.user.userSelected);
  const { userId } = useParams();

  useEffect(() => {
    dispatch(getUserInfo({ userId, getCurrentUser: false }));
    dispatch(getUserPosts(userId));
    dispatch(changePage({ nextPage: PageConstant.USER }));
    window.scrollTo(0, 0);
  }, [userId]);

  return (
    <>
      <ContainerLayout>
        <UserHeader user={userSelected} />
        <div
          style={{
            marginTop: "24px",
          }}
        >
          <ListPost />
        </div>
      </ContainerLayout>
    </>
  );
};

export default UserPage;

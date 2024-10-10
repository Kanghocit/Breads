import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Route, USER_PATH } from "../Breads-Shared/APIConfig";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import ListPost from "../components/ListPost";
import ContainerLayout from "../components/MainBoxLayout";
import UserHeader from "../components/UserHeader";
import { GET } from "../config/API";
import { getUserPosts } from "../store/PostSlice/asyncThunk";
import { getUserInfo } from "../store/UserSlice/asyncThunk";
import { changePage } from "../store/UtilSlice";

const UserPage = () => {
  const dispatch = useDispatch();
  const userSelected = useSelector((state) => state.user.userSelected);
  const [usersFollow, setUsersFollow] = useState({
    followed: [],
    following: [],
  });
  const { userId } = useParams();

  useEffect(() => {
    dispatch(getUserInfo({ userId, getCurrentUser: false }));
    dispatch(getUserPosts(userId));
    dispatch(changePage({ nextPage: PageConstant.USER }));
    handleGetUsersFollow();
    window.scrollTo(0, 0);
  }, [userId]);

  const handleGetUsersFollow = async () => {
    try {
      const data = await GET({
        path: Route.USER + USER_PATH.USERS_FOLLOW,
        params: {
          userId: userId,
        },
      });
      setUsersFollow({
        followed: data.followed,
        following: data.following,
      });
    } catch (err) {
      console.error("handleGetUsersFollow: ", err);
    }
  };

  return (
    <>
      <ContainerLayout>
        <UserHeader user={userSelected} usersFollow={usersFollow} />
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

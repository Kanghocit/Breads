import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Route, USER_PATH } from "../Breads-Shared/APIConfig";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import ContainerLayout from "../components/MainBoxLayout";
import UserHeader from "../components/UserHeader";
import { GET } from "../config/API";
import { getUserPosts } from "../store/PostSlice/asyncThunk";
import { getUserInfo } from "../store/UserSlice/asyncThunk";
import { changeDisplayPageData } from "../store/UtilSlice";
import { changePage } from "../store/UtilSlice/asyncThunk";

const UserPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userSelected, userInfo } = useSelector((state) => state.user);
  const displayPageData = useSelector((state) => state.util.displayPageData);
  const [usersFollow, setUsersFollow] = useState({
    followed: [],
    following: [],
  });
  const { userId } = useParams();

  useEffect(() => {
    fetchUserData();
    window.scrollTo(0, 0);
    dispatch(changeDisplayPageData(""));
  }, [userId]);

  useEffect(() => {
    if (!!userId) {
      dispatch(getUserPosts(userId));
    }
  }, [displayPageData, userId]);

  const fetchUserData = async () => {
    try {
      const result = await dispatch(
        getUserInfo({ userId, getCurrentUser: false })
      ).unwrap();
      if (!result || result.error) {
        navigate("/error");
      } else {
        dispatch(
          changePage({
            nextPage:
              userId === userInfo?._id
                ? PageConstant.USER
                : PageConstant.FRIEND,
          })
        );
        handleGetUsersFollow();
      }
    } catch (err) {
      console.error("fetchUserData: ", err);
      navigate("/error");
    }
  };

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
      </ContainerLayout>
    </>
  );
};

export default UserPage;

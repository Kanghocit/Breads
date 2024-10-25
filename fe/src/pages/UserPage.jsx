import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Route, USER_PATH } from "../Breads-Shared/APIConfig";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import ListPost from "../components/ListPost";
import ContainerLayout from "../components/MainBoxLayout";
import UserHeader from "../components/UserHeader";
import { GET } from "../config/API";
import { getUserPosts } from "../store/PostSlice/asyncThunk";
import { getUserInfo } from "../store/UserSlice/asyncThunk";
import { changePage } from "../store/UtilSlice";
import ErrorPage from "./ErrorPage";

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
  }, [userId]);

  useEffect(() => {
    if (!!userId) {
      dispatch(getUserPosts(userId));
    }
  }, [displayPageData]);

  const fetchUserData = async () => {
    try {
      const result = await dispatch(
        getUserInfo({ userId, getCurrentUser: false })
      ).unwrap();
      if (!result || result.error) {
        navigate("/error");
      } else {
        dispatch(getUserPosts(userId));
        dispatch(changePage({ nextPage: PageConstant.USER }));
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

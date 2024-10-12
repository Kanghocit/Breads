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
  const dispatch = useDispatch();
  const userSelected = useSelector((state) => state.user.userSelected);
  
  const navigate = useNavigate();
  const [usersFollow, setUsersFollow] = useState({
    followed: [],
    following: [],
  });
  const { userId } = useParams();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await dispatch(getUserInfo({ userId, getCurrentUser: false })).unwrap();
        
        if (!result || result.error) {
          navigate("/error");
        } else {
          dispatch(getUserPosts(userId));
          dispatch(changePage({ nextPage: PageConstant.USER }));
          handleGetUsersFollow();
        }
      } catch (error) {
        navigate("/error");
      }
    };

    fetchUserData();
    window.scrollTo(0, 0);
  }, [userId, dispatch, navigate]);

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

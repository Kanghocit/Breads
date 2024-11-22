import { Container } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import * as APIConfig from "./Breads-Shared/APIConfig";
import PageConstant from "./Breads-Shared/Constants/PageConstants";
import CreatePostBtn from "./components/CreatePostBtn";
import PostPopup from "./components/PostPopup";
import NotificationCreatePost from "./components/PostPopup/NotificationPost";
import SeeMedia from "./components/SeeMedia";
import Layout from "./Layout";
import { HeaderHeight } from "./Layout/Header";
import ActivityPage from "./pages/ActivityPage";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import PostDetail from "./pages/PostDetail";
import ResetPWPage from "./pages/ResetPWPage";
import SearchPage from "./pages/SearchPage";
import SettingPage from "./pages/SettingPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import UserPage from "./pages/UserPage";
import Socket from "./socket";
import { clearNotificationPostId } from "./store/ToastCreatedPost";
import { getUserInfo } from "./store/UserSlice/asyncThunk";
import PostConstants from "./util/PostConstants";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const userId = localStorage.getItem("userId");
  const userInfo = useSelector((state) => state.user.userInfo);
  const { seeMediaInfo, currentPage } = useSelector((state) => state.util);
  const postAction = useSelector((state) => state.post.postAction);
  const { CREATE, EDIT, REPLY, REPOST } = PostConstants.ACTIONS;
  const openPostPopup = [CREATE, EDIT, REPLY, REPOST].includes(postAction);
  const toastPostId = useSelector(
    (state) => state.notificationCreatedPosts.postId
  );

  useEffect(() => {
    if (!!userId) {
      handleGetUserInfo();
    }
  }, []);

  useEffect(() => {
    if (userInfo?._id) {
      handleConnect();
    }
  }, [userInfo._id]);

  const handleConnect = async () => {
    const socket = Socket.getInstant();
    const userPayload = {
      userId: userInfo._id,
      userFollowed: userInfo.followed,
      userFollowing: userInfo.following,
    };
    socket.emitWithAck(
      APIConfig.Route.USER + APIConfig.USER_PATH.CONNECT,
      userPayload
    );
  };

  const handleGetUserInfo = async () => {
    try {
      dispatch(getUserInfo({ userId, getCurrentUser: true }));
    } catch (err) {
      console.error(err);
    }
  };

  const ActivityRoute = () => {
    const { ACTIVITY, ALL, FOLLOWS, REPLIES, MENTIONS, LIKES, REPOSTS } =
      PageConstant;
    return [ALL, FOLLOWS, REPLIES, MENTIONS, LIKES, REPOSTS].map((page) => (
      <Route
        key={`route-${page}`}
        path={ALL ? `${ACTIVITY}` : `${ACTIVITY}/${page}`}
        element={
          !!userId ? (
            <ActivityPage />
          ) : (
            <Navigate to={`/${PageConstant.AUTH}`} />
          )
        }
      />
    ));
  };

  const HomeRoute = () => {
    const { FOR_YOU, FOLLOWING, LIKED, SAVED } = PageConstant;
    return ["", FOR_YOU, FOLLOWING, LIKED, SAVED].map((page) => (
      <Route
        key={`route-${page}`}
        path={`/${page}`}
        element={
          !!userId ? <HomePage /> : <Navigate to={`/${PageConstant.AUTH}`} />
        }
      />
    ));
  };
  // useEffect(() => {
  //   if (toastPostId) {
  //     const timer = setTimeout(() => {
  //       handleCloseToast();
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [toastPostId]);

  const handleCloseToast = () => {
    dispatch(clearNotificationPostId());
  };

  return (
    <div
      className="app"
      style={{
        marginTop:
          ![
            PageConstant.SIGNUP,
            PageConstant.LOGIN,
            PageConstant.RESET_PW,
          ].includes(currentPage) && HeaderHeight + 12 + "px",
      }}
    >
      {!!userId && !seeMediaInfo.open && location.pathname !== "/error" && (
        <Layout />
      )}
      <Container maxW="620px">
        {!!userId &&
          !seeMediaInfo.open &&
          location.pathname !== "/error" &&
          !location.pathname?.includes("chat") && <CreatePostBtn />}
      </Container>

      <Routes>
        {HomeRoute()}
        <Route
          path={`/${PageConstant.AUTH}`}
          element={!userId ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route
          path="/update"
          element={
            !!userId ? (
              <UpdateProfilePage />
            ) : (
              <Navigate to={`/${PageConstant.AUTH}`} />
            )
          }
        />
        <Route path="/reset-pw/:userId/:code" element={<ResetPWPage />} />
        <Route path="/users/:userId" element={<UserPage />} />
        <Route
          path="/posts/:postId"
          element={<PostDetail key={location.pathname} />}
        />
        <Route path={`/${PageConstant.SEARCH}`} element={<SearchPage />} />
        <Route path={`/${PageConstant.SETTING}`} element={<SettingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:conversationId" element={<ChatPage />} />
        <Route path="*" element={<ErrorPage />} />
        {ActivityRoute()}
      </Routes>
      {seeMediaInfo.open && <SeeMedia />}
      {openPostPopup && <PostPopup />}
      {toastPostId && (
        <NotificationCreatePost
          postId={toastPostId}
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
}

export default App;

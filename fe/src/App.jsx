import { Container } from "@chakra-ui/react";
import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import * as APIConfig from "./Breads-Shared/APIConfig";
import { Constants } from "./Breads-Shared/Constants";
import PageConstant from "./Breads-Shared/Constants/PageConstants";
import PostConstants from "./Breads-Shared/Constants/PostConstants";
import { HeaderHeight } from "./Layout";
import Socket from "./socket";
import { clearNotificationPostId } from "./store/ToastCreatedPost";
import { getUserInfo } from "./store/UserSlice/asyncThunk";

const AuthPage = lazy(() => import("./pages/AuthPage"));
const CreatePostBtn = lazy(() => import("./components/CreatePostBtn"));
const PostPopup = lazy(() => import("./components/PostPopup"));
const NotificationCreatePost = lazy(() =>
  import("./components/PostPopup/NotificationPost")
);
const SeeMedia = lazy(() => import("./components/SeeMedia"));
const Layout = lazy(() => import("./Layout"));
const ActivityPage = lazy(() => import("./pages/ActivityPage"));
const AdminPage = lazy(() => import("./pages/Admin"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const ResetPWPage = lazy(() => import("./pages/ResetPWPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const SettingPage = lazy(() => import("./pages/SettingPage"));
const UpdateProfilePage = lazy(() => import("./pages/UpdateProfilePage"));
const UserPage = lazy(() => import("./pages/UserPage"));

const wrapSuspense = (cpn) => {
  return <Suspense>{cpn}</Suspense>;
};

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
  const isAdmin = userInfo?.role === Constants.USER_ROLE.ADMIN;

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
            wrapSuspense(<ActivityPage />)
          ) : (
            <Navigate to={`/${PageConstant.AUTH}`} />
          )
        }
      />
    ));
  };

  const HomeRoute = () => {
    const { HOME, FOR_YOU, FOLLOWING, LIKED, SAVED } = PageConstant;
    return ["", HOME, FOR_YOU, FOLLOWING, LIKED, SAVED].map((page) => (
      <Route
        key={`route-${page}`}
        path={`/${page}`}
        element={
          !!userId ? (
            wrapSuspense(<HomePage />)
          ) : (
            <Navigate to={`/${PageConstant.AUTH}`} />
          )
        }
      />
    ));
  };

  const AdminRoute = () => {
    const { DEFAULT, POSTS, POSTS_VALIDATION, USERS } = PageConstant.ADMIN;
    return [DEFAULT, POSTS, USERS, POSTS_VALIDATION].map((page) => (
      <Route
        key={`route-${page}`}
        path={`/${page}`}
        element={
          !!userId ? (
            isAdmin ? (
              wrapSuspense(<AdminPage />)
            ) : (
              <></>
            )
          ) : (
            wrapSuspense(<ErrorPage />)
          )
        }
      />
    ));
  };

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
            PageConstant.ADMIN.DEFAULT,
            PageConstant.ADMIN.POSTS,
            PageConstant.ADMIN.POSTS_VALIDATION,
            PageConstant.ADMIN.USERS,
          ].includes(currentPage) && HeaderHeight + 12 + "px",
      }}
    >
      {!seeMediaInfo.open &&
        location.pathname !== "/error" &&
        userInfo?._id &&
        wrapSuspense(<Layout />)}
      <Container maxW="620px">
        {!!userId &&
          !seeMediaInfo.open &&
          location.pathname !== "/error" &&
          !location.pathname?.includes("chat") &&
          !isAdmin &&
          wrapSuspense(<CreatePostBtn />)}
      </Container>

      <Routes>
        {HomeRoute()}
        <Route
          path={`/${PageConstant.AUTH}`}
          element={!userId ? wrapSuspense(<AuthPage />) : <Navigate to="/" />}
        />
        <Route
          path="/update"
          element={
            !!userId ? (
              wrapSuspense(<UpdateProfilePage />)
            ) : (
              <Navigate to={`/${PageConstant.AUTH}`} />
            )
          }
        />
        <Route
          path="/reset-pw/:userId/:code"
          element={wrapSuspense(<ResetPWPage />)}
        />
        <Route path="/users/:userId" element={wrapSuspense(<UserPage />)} />
        <Route
          path="/posts/:postId"
          element={<PostDetail key={location.pathname} />}
        />
        <Route
          path={`/${PageConstant.SEARCH}`}
          element={wrapSuspense(<SearchPage />)}
        />
        <Route
          path={`/${PageConstant.SETTING}`}
          element={wrapSuspense(<SettingPage />)}
        />
        <Route path="/chat" element={wrapSuspense(<ChatPage />)} />
        <Route
          path="/chat/:conversationId"
          element={wrapSuspense(<ChatPage />)}
        />
        {AdminRoute()}
        {ActivityRoute()}
        <Route path="*" element={wrapSuspense(<ErrorPage />)} />
      </Routes>
      {seeMediaInfo.open && wrapSuspense(<SeeMedia />)}
      {openPostPopup && wrapSuspense(<PostPopup />)}
      {toastPostId &&
        wrapSuspense(
          <NotificationCreatePost
            postId={toastPostId}
            onClose={handleCloseToast}
          />
        )}
    </div>
  );
}

export default App;

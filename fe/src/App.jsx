import { Container } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import PageConstant from "../../share/Constants/PageConstants";
import CreatePostBtn from "./components/CreatePostBtn";
import PostPopup from "./components/PostPopup";
import SeeMedia from "./components/SeeMedia";
import Layout from "./Layout";
import { HeaderHeight } from "./Layout/Header";
import ActivityPage from "./pages/ActivityPage";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import PostDetail from "./pages/PostDetail";
import PostPage from "./pages/PostPage";
import SearchPage from "./pages/SearchPage";
import SettingPage from "./pages/SettingPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import UserPage from "./pages/UserPage";
import { getUserInfo } from "./store/UserSlice/asyncThunk";
import PostConstants from "./util/PostConstants";

function App() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const userId = userInfo._id ? userInfo._id : localStorage.getItem("userId");
  const seeMediaInfo = useSelector((state) => state.util.seeMediaInfo);
  const postAction = useSelector((state) => state.post.postAction);
  const openPostPopup =
    postAction === PostConstants.ACTIONS.CREATE ||
    postAction === PostConstants.ACTIONS.EDIT;

  useEffect(() => {
    if (!!userId) {
      handleGetUserInfo();
    }
  }, []);

  const handleGetUserInfo = async () => {
    try {
      dispatch(getUserInfo({ userId: userId }));
    } catch (err) {
      console.error(err);
    }
  };

  const ActivityRoute = () => {
    const { ACTIVITY, FOLLOWS, REPLIES, MENTIONS, QUOTES, REPOSTS } =
      PageConstant;
    return ["", FOLLOWS, REPLIES, MENTIONS, QUOTES, REPOSTS].map((page) => (
      <Route
        key={`route-${page}`}
        path={`${ACTIVITY}/${page}`}
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

  return (
    <div
      className="app"
      style={{
        marginTop: HeaderHeight,
      }}
    >
      {!!userId && !seeMediaInfo.open && <Layout />}
      <Container maxW="620px">
        {!!userId && !seeMediaInfo.open && <CreatePostBtn />}
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

        <Route path="/user/:userId" element={<UserPage />} />
        <Route path="/:username/post/:pid" element={<PostPage />} />
        <Route path="/post/:postId" element={<PostDetail />} />
        <Route path={`/${PageConstant.SEARCH}`} element={<SearchPage />} />
        <Route path={`/${PageConstant.SETTING}`} element={<SettingPage />} />
        {ActivityRoute()}
      </Routes>
      {seeMediaInfo.open && <SeeMedia />}
      {openPostPopup && <PostPopup />}
    </div>
  );
}

export default App;

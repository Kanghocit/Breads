import { Container } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import CreatePostBtn from "./components/CreatePostBtn";
import LeftSideBar from "./Layout/LeftSidebar";
import PostPopup from "./components/PostPopup";
import SeeMedia from "./components/SeeMedia";
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
import PageConstant from "./util/PageConstants";
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

  return (
    <div className="app">
      <Container maxW="620px">
        {userId && <LeftSideBar />}

        {!!userId && <CreatePostBtn />}
      </Container>
      <Routes>
        <Route
          path="/"
          element={
            !!userId ? <HomePage /> : <Navigate to={`/${PageConstant.AUTH}`} />
          }
        />
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
        <Route path={`/${PageConstant.ACTIVITY}`} element={<ActivityPage />} />
      </Routes>
      {seeMediaInfo.open && <SeeMedia />}
      {openPostPopup && <PostPopup />}
    </div>
  );
}

export default App;

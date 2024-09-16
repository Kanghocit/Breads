import { Container } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import CreatePost from "./components/CreatePost";
import Header from "./components/Header";
import LogoutButton from "./components/LogoutButton";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import UserPage from "./pages/UserPage";
import { useEffect } from "react";
import { getUserInfo } from "./store/UserSlice/asyncThunk";
import PostDetail from "./pages/PostDetail";
import SeeMedia from "./components/SeeMedia";
import PostPopup from "./components/PostPopup";
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
        <Header />

        {!!userId && <LogoutButton />}
        {!!userId && <CreatePost />}
      </Container>
      <Routes>
        <Route
          path="/"
          element={!!userId ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={!userId ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route
          path="/update"
          element={!!userId ? <UpdateProfilePage /> : <Navigate to="/auth" />}
        />

        <Route path="/user/:userId" element={<UserPage />} />
        <Route path="/:username/post/:pid" element={<PostPage />} />
        <Route path="/post/:postId" element={<PostDetail />} />
      </Routes>
      {seeMediaInfo.open && <SeeMedia />}
      {openPostPopup && <PostPopup />}
    </div>
  );
}

export default App;

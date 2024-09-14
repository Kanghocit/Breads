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

function App() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const userId = userInfo._id
    ? userInfo._id
    : JSON.parse(localStorage.getItem("userId"));

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

        <Route path="/:userId" element={<UserPage />} />
        <Route path="/:username/post/:pid" element={<PostPage />} />
      </Routes>
    </div>
  );
}

export default App;

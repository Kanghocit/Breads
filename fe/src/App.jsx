import { Container } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import CreatePost from "./components/CreatePost";
import Header from "./components/Header";
import LogoutButton from "./components/LogoutButton";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import UserPage from "./pages/UserPage";

function App() {
  const useId = useSelector((state) => state.user.userInfo._id);
  console.log(!!useId);

  return (
    <Container maxW="620px">
      <Header />
      <Routes>
        <Route
          path="/"
          element={!!useId ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={!useId ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route
          path="/update"
          element={!!useId ? <UpdateProfilePage /> : <Navigate to="/auth" />}
        />

        <Route path="/:username" element={<UserPage />} />
        <Route path="/:username/post/:pid" element={<PostPage />} />
      </Routes>

      {!!useId && <LogoutButton />}
      {!!useId && <CreatePost />}
    </Container>
  );
}

export default App;

import { useSelector } from "react-redux";
import Login from "../components/Login";
import Signup from "../components/SignUp";
import PageConstant from "../Breads-Shared/Constants/PageConstants";

const AuthPage = () => {
  const currentPage = useSelector((state) => state.util.currentPage);

  return <>{currentPage === PageConstant.LOGIN ? <Login /> : <Signup />}</>;
};

export default AuthPage;

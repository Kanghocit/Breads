import { useSelector } from "react-redux";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import Login from "./Login";
import Signup from "./SignUp";

const AuthPage = () => {
  const currentPage = useSelector((state) => state.util.currentPage);

  return <>{currentPage === PageConstant.LOGIN ? <Login /> : <Signup />}</>;
};

export default AuthPage;

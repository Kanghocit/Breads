import { Button } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // Sử dụng useNavigate để điều hướng
import { useDispatch } from "react-redux";
import { logout } from "../store/UserSlice/asyncThunk";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const showToast = useShowToast();
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleLogout = async () => {
    try {
      dispatch(logout());
      navigate("/auth"); // Điều hướng về trang xác thực sau khi đăng xuất
    } catch (error) {
      showToast("Error", error.message, "error"); // Hiển thị lỗi khi không thể đăng xuất
    }
  };

  return (
    <Button
      position={"fixed"}
      top={"30px"}
      right={"30px"}
      size={"sm"}
      onClick={handleLogout}
    >
      <FiLogOut size={20} />
    </Button>
  );
};

export default LogoutButton;

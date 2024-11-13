import { Button } from "@chakra-ui/react";
import { FaRegHeart, FaFacebookMessenger } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePage } from "../../store/UtilSlice/asyncThunk";
import PageConstant from "../../Breads-Shared/Constants/PageConstants";

export const BtnLike = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { colorMode } = useSelector((state) => state.util);
  const { currentPage } = useSelector((state) => state.util);

  const getButtonColor = (isActive, colorMode) => {
    if (isActive) {
      return colorMode === "dark" ? "#f3f5f7" : "#000000";
    }
    return colorMode === "dark" ? "#4d4d4d" : "#a0a0a0";
  };

  const handleClick = () => {
    if (currentPage !== PageConstant.ACTIVITY) {
      dispatch(changePage({ currentPage, nextPage: PageConstant.ACTIVITY }));
    }
    navigate("/" + PageConstant.ACTIVITY);
  };

  return (
    <Button
      bg="transparent"
      color={getButtonColor(currentPage === PageConstant.ACTIVITY, colorMode)}
      onClick={handleClick}
      width="60px"
      height="60px"
      minW="60px"
      minH="60px"
    >
      <FaRegHeart size={24} />
    </Button>
  );
};

export const BtnMess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { colorMode } = useSelector((state) => state.util);
  const { currentPage } = useSelector((state) => state.util);

  const getButtonColor = (isActive, colorMode) => {
    if (isActive) {
      return colorMode === "dark" ? "#f3f5f7" : "#000000";
    }
    return colorMode === "dark" ? "#4d4d4d" : "#a0a0a0";
  };

  const handleClick = () => {
    if (currentPage !== PageConstant.CHAT) {
      dispatch(changePage({ currentPage, nextPage: PageConstant.CHAT }));
    }
    navigate("/" + PageConstant.CHAT);
  };

  return (
    <Button
      bg="transparent"
      color={getButtonColor(currentPage === PageConstant.CHAT, colorMode)}
      onClick={handleClick}
      width="60px"
      height="60px"
      minW="60px"
      minH="60px"
    >
      <FaFacebookMessenger size={24} />
    </Button>
  );
};

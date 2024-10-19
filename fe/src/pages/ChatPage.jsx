import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MESSAGE_PATH, Route } from "../Breads-Shared/APIConfig";
import LeftSideBarMsg from "../components/Message/LeftSideBar";
import RightSideMsg from "../components/Message/RightSide";
import Socket from "../socket";
import { getConversations } from "../store/MessageSlice";

const ChatPage = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    if (!!userInfo._id) {
      handleGetUserConversations();
    }
  }, [userInfo._id]);

  const handleGetUserConversations = async () => {
    const socket = Socket.getInstant();
    socket.emit(
      Route.MESSAGE + MESSAGE_PATH.GET_CONVERSATIONS,
      { userId: userInfo._id },
      (res) => {
        const { data } = res;
        if (data) {
          dispatch(getConversations(data));
        }
      }
    );
  };

  return (
    <Flex
      position={"absolute"}
      left={"50%"}
      w={{
        base: "100%",
        md: "80%",
        lg: "90%",
      }}
      pl={"24px"}
      pr={3}
      transform={"translateX(-50%)"}
      gap={"24px"}
    >
      <LeftSideBarMsg />
      <RightSideMsg />
    </Flex>
  );
};

export default ChatPage;

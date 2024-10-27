import { Flex } from "@chakra-ui/react";
import LeftSideBarMsg from "../components/Message/LeftSideBar";
import RightSideMsg from "../components/Message/RightSide";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversationById } from "../store/MessageSlice/asyncThunk";

const ChatPage = () => {
  const dispatch = useDispatch();
  const { conversationId } = useParams();
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );

  useEffect(() => {
    if (!!conversationId) {
      if (
        !selectedConversation ||
        selectedConversation?._id !== conversationId
      ) {
        dispatch(getConversationById(conversationId));
      }
    }
  }, [conversationId]);

  return (
    <Flex
      position={"absolute"}
      left={"55%"}
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

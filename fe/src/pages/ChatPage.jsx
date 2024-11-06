import { Flex } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import LeftSideBarMsg from "../components/Message/LeftSideBar";
import RightSideMsg from "../components/Message/RightSide";
import { getConversationById } from "../store/MessageSlice/asyncThunk";
import { changePage } from "../store/UtilSlice/asyncThunk";

const ChatPage = () => {
  const dispatch = useDispatch();
  const { conversationId } = useParams();
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const init = useRef(true);

  useEffect(() => {
    if (!!conversationId) {
      if (
        !selectedConversation ||
        selectedConversation?._id !== conversationId
      ) {
        dispatch(getConversationById(conversationId));
      }
    }
    if (init.current) {
      dispatch(changePage({ nextPage: PageConstant.CHAT }));
      init.current = false;
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

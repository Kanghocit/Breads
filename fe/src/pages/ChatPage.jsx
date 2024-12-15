import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import LeftSideBarMsg from "../components/Message/LeftSideBar";
import RightSideMsg from "../components/Message/RightSide";
import { selectConversation } from "../store/MessageSlice";
import { getConversationById } from "../store/MessageSlice/asyncThunk";
import { changePage } from "../store/UtilSlice/asyncThunk";
import { addEvent } from "../util";

const ChatPage = () => {
  const dispatch = useDispatch();
  const { conversationId } = useParams();
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const init = useRef(true);
  const [showRightSide, setShowRightSide] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const marginBottom = useBreakpointValue({ base: "50px", md: "0" });

  useEffect(() => {
    addEvent({
      event: "see_page",
      payload: {
        page: "chat",
      },
    });
  }, []);

  useEffect(() => {
    if (!!conversationId) {
      if (
        !selectedConversation ||
        selectedConversation?._id !== conversationId
      ) {
        dispatch(getConversationById(conversationId));
      }
      if (isMobile) {
        setShowRightSide(true);
      }
    }
    if (init.current) {
      dispatch(changePage({ nextPage: PageConstant.CHAT }));
      init.current = false;
    }
  }, [conversationId, isMobile]);

  const handleBackToLeft = () => {
    setShowRightSide(false);
    dispatch(selectConversation(null));
  };

  return (
    <Flex
      id={"chat-page"}
      position="absolute"
      left="50%"
      w={{
        base: "100%",
        md: "80%",
        lg: "90%",
      }}
      pl="24px"
      pr={3}
      transform="translateX(-50%)"
      gap="24px"
      // bottom={isMobile ? "100px" : "0px"}
    >
      {!isMobile || !showRightSide ? (
        <Box
          w={isMobile ? "100%" : "30%"}
          display={showRightSide && isMobile ? "none" : "block"}
        >
          <LeftSideBarMsg onSelectConversation={() => setShowRightSide(true)} />
        </Box>
      ) : null}

      {!isMobile || showRightSide ? (
        <Box w="100%" display={!showRightSide && isMobile ? "none" : "block"}>
          <RightSideMsg
            onBack={handleBackToLeft}
            onDetailBack={() => setShowRightSide(true)}
          />
        </Box>
      ) : null}
    </Flex>
  );
};

export default ChatPage;

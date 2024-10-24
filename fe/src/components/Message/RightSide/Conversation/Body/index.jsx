import { Flex, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MESSAGE_PATH, Route } from "../../../../../Breads-Shared/APIConfig";
import useSocket from "../../../../../hooks/useSocket";
import Socket from "../../../../../socket";
import { addNewMsg, getMsgs } from "../../../../../store/MessageSlice";
import Message from "./Message";

const ConversationBody = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const { selectedConversation, messages } = useSelector(
    (state) => state.message
  );
  const conversationScreenRef = useRef(null);

  useEffect(() => {
    if (selectedConversation?._id && userInfo?._id) {
      handleGetMsgs();
    }
  }, [selectedConversation?._id, userInfo]);

  useSocket((socket) => {
    socket.on(Route.MESSAGE + MESSAGE_PATH.GET_MESSAGE, (payload) => {
      if (payload) {
        dispatch(addNewMsg(payload));
        scrollToBottom();
      }
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const scrollToBottom = () => {
    if (conversationScreenRef?.current) {
      conversationScreenRef.current.scrollTo({
        top: conversationScreenRef?.current?.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleGetMsgs = async () => {
    const socket = Socket.getInstant();
    socket.emit(
      Route.MESSAGE + MESSAGE_PATH.GET_MESSAGES,
      {
        userId: userInfo._id,
        conversationId: selectedConversation?._id,
      },
      (res) => {
        const { data } = res;
        dispatch(
          getMsgs({
            isNew: true,
            msgs: data,
          })
        );
      }
    );
  };

  return (
    <div
      ref={conversationScreenRef}
      style={{
        height: "460px",
        overflowY: "auto",
      }}
    >
      <Flex
        flexDir={"column"}
        gap={4}
        my={4}
        height={"fit-content"}
        py={2}
        px={3}
      >
        {false &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir={"column"} gap={2}>
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}
        {messages?.length !== 0 &&
          messages?.map((msg) => <Message key={msg?._id} msg={msg} />)}
      </Flex>
    </div>
  );
};

export default ConversationBody;

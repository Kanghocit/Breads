import { Flex, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MESSAGE_PATH, Route } from "../../../../../Breads-Shared/APIConfig";
import Socket from "../../../../../socket";
import Message from "./Message";

const ConversationBody = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    if (selectedConversation?._id && userInfo?._id) {
      handleGetMsgs();
    }
  }, [selectedConversation, userInfo]);

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
        setMsgs(data);
      }
    );
  };

  return (
    <Flex
      flexDir={"column"}
      gap={4}
      my={4}
      px={2}
      height={"460px"}
      overflowY={"auto"}
      p={2}
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
      {msgs?.length !== 0 &&
        msgs?.map((msg) => <Message key={msg?._id} msg={msg} />)}
    </Flex>
  );
};

export default ConversationBody;

import { Avatar, Flex, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const Message = ({ msg }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const participant = useSelector(
    (state) => state.message.selectedConversation?.participant
  );
  const ownMessage = userInfo?._id !== participant?._id;
  const { content, createdAt, files, media } = msg;

  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          <Text maxW={"350px"} bg={"blue.400"} p={2} mr={2} borderRadius={"md"}>
            {content}
          </Text>
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar src={participant?.avatar} w={7} h={7} />
          <Text
            maxW={"350px"}
            bg={"gray.400"}
            p={2}
            ml={2}
            borderRadius={"md"}
            color={"black"}
          >
            {content}
          </Text>
        </Flex>
      )}
    </>
  );
};

export default Message;

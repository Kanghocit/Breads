import { Divider, Flex, useColorModeValue } from "@chakra-ui/react";
import ConversationBody from "./Conversation/Body";
import ConversationHeader from "./Conversation/Header";
import MessageInput from "./Conversation/MessageBar";

const RightSideMsg = () => {
  return (
    <Flex
      flex={70}
      bg={useColorModeValue("gray.200", "#181818")}
      borderRadius={"md"}
      flexDirection={"column"}
      overflow={"hidden"}
    >
      <ConversationHeader />
      <Divider />
      <ConversationBody />
      <MessageInput />
    </Flex>
  );
};

export default RightSideMsg;

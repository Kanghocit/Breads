import { Divider, Flex, useColorModeValue } from "@chakra-ui/react";
import ConversationBody from "./Body";
import ConversationHeader from "./Header";
import MessageInput from "./MessageBar";

const ConversationScreen = ({ openDetailTab, setOpenDetailTab }) => {
  return (
    <Flex
      flex={1}
      bg={useColorModeValue("gray.200", "#181818")}
      borderRadius={"md"}
      flexDirection={"column"}
      overflow={"hidden"}
    >
      <ConversationHeader
        openDetailTab={openDetailTab}
        setOpenDetailTab={setOpenDetailTab}
      />
      <Divider />
      <ConversationBody />
      <MessageInput />
    </Flex>
  );
};

export default ConversationScreen;

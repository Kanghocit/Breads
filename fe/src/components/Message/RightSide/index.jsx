import { Container, Divider, Flex, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import ConversationBody from "./Conversation/Body";
import ConversationHeader from "./Conversation/Header";
import MessageInput from "./Conversation/MessageBar";
import DetailConversationTab from "./DetailTab";

const RightSideMsg = () => {
  const [openDetailTab, setOpenDetailTab] = useState(false);

  return (
    <Flex flex={70}>
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
      {openDetailTab && (
        <Container width={"20vw"}>
          <DetailConversationTab />
        </Container>
      )}
    </Flex>
  );
};

export default RightSideMsg;

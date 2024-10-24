import { Container, Flex } from "@chakra-ui/react";
import { useState } from "react";
import ConversationScreen from "./Conversation";
import DetailConversationTab from "./DetailTab";

const RightSideMsg = () => {
  const [openDetailTab, setOpenDetailTab] = useState(false);

  return (
    <Flex flex={70}>
      <ConversationScreen
        openDetailTab={openDetailTab}
        setOpenDetailTab={setOpenDetailTab}
      />
      {openDetailTab && (
        <Container width={"20vw"}>
          <DetailConversationTab />
        </Container>
      )}
    </Flex>
  );
};

export default RightSideMsg;

import { Container, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useState } from "react";
import ConversationScreen from "./Conversation";
import DetailConversationTab from "./DetailTab";

const RightSideMsg = ({ onBack }) => {
  const [openDetailTab, setOpenDetailTab] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex flex={isMobile ? 1 : 70} width="100%" minWidth="300px">
      <ConversationScreen
        openDetailTab={openDetailTab}
        setOpenDetailTab={setOpenDetailTab}
        onBack={onBack}
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

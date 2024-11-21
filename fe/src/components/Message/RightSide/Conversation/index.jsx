import {
  Container,
  Divider,
  Flex,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { HeaderHeight } from "../../../../Layout/Header";
import ConversationBody from "./Body";
import ConversationHeader from "./Header";
import MessageInput from "./MessageBar";

const ConversationScreen = ({ openDetailTab, setOpenDetailTab, onBack }) => {
  const footerOffset = useBreakpointValue({ base: 75, md: 24 });
  // const footerOffset = 24
  return (
    <Flex
      flex={1}
      bg={useColorModeValue("gray.200", "#181818")}
      borderRadius={"md"}
      flexDirection={"column"}
      overflow={"hidden"}
      position={"relative"}
      height={`calc(100vh - ${HeaderHeight}px - ${footerOffset}px)`}
    >
      <ConversationHeader
        openDetailTab={openDetailTab}
        setOpenDetailTab={setOpenDetailTab}
        onBack={onBack}
      />
      <Divider />
      <ConversationBody openDetailTab={openDetailTab} />
      <Container
        position={"absolute"}
        bottom={0}
        left={0}
        width={"100%"}
        maxWidth={"100%"}
        padding={0}
        height={"56px"}
      >
        <MessageInput />
      </Container>
    </Flex>
  );
};

export default ConversationScreen;

import { Container, Divider, Flex, useColorModeValue } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { HeaderHeight } from "../../../../Layout/Header";
import ConversationBody from "./Body";
import ConversationHeader from "./Header";
import MessageInput from "./MessageBar";
import RepliedMsgBar from "./MessageBar/RepliedMsgBar";
import UploadDisplay from "./MessageBar/UploadDisplay";

const ConversationScreen = ({ openDetailTab, setOpenDetailTab }) => {
  const { msgInfo, selectedMsg } = useSelector((state) => state.message);
  const { files, media } = msgInfo;

  return (
    <Flex
      flex={1}
      bg={useColorModeValue("gray.200", "#181818")}
      borderRadius={"md"}
      flexDirection={"column"}
      overflow={"hidden"}
      position={"relative"}
      height={`calc(100vh - ${HeaderHeight}px - 24px)`}
    >
      <ConversationHeader
        openDetailTab={openDetailTab}
        setOpenDetailTab={setOpenDetailTab}
      />
      <Divider />
      <ConversationBody openDetailTab={openDetailTab} />
      {selectedMsg?._id && <RepliedMsgBar />}
      {((!!files && files?.length !== 0) || media?.length !== 0) && (
        <UploadDisplay />
      )}
      <Container
        left={0}
        width={"100%"}
        maxWidth={"100%"}
        padding={0}
        minHeight={"56px"}
        height={"fit-content"}
      >
        <MessageInput />
      </Container>
    </Flex>
  );
};

export default ConversationScreen;

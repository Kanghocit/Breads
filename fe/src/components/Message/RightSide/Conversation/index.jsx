import {
  Container,
  Divider,
  Flex,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { HeaderHeight } from "../../../../Layout";
import ConversationBody from "./Body";
import ConversationHeader from "./Header";
import MessageInput from "./MessageBar";
import RepliedMsgBar from "./MessageBar/RepliedMsgBar";
import UploadDisplay from "./MessageBar/UploadDisplay";
import { Constants } from "../../../../Breads-Shared/Constants";

const ConversationScreen = ({ openDetailTab, setOpenDetailTab, onBack }) => {
  const { msgInfo, selectedMsg, msgAction } = useSelector(
    (state) => state.message
  );
  const { files, media } = msgInfo;
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
      <ConversationBody openDetailTab={openDetailTab} />
      {selectedMsg?._id && msgAction === Constants.MSG_ACTION.REPLY && (
        <RepliedMsgBar />
      )}
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

import { Avatar, Flex, Text, Tooltip } from "@chakra-ui/react";
import moment from "moment";
import { useSelector } from "react-redux";
import { isDifferentDate } from "../../../../../../util";
import FileMsg from "./Files";

const Message = ({ msg }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const participant = useSelector(
    (state) => state.message.selectedConversation?.participant
  );
  const ownMessage = msg?.sender === userInfo?._id;
  const { content, createdAt, file, media } = msg;

  const getTooltipTime = () => {
    // const createdLocalTime = convertUTCToLocalTime(createdAt);
    const currentDate = new Date();
    const createdAtDate = new Date(createdAt);
    let format = "";
    const isDiffDate = isDifferentDate(createdAtDate, currentDate);
    if (isDiffDate) {
      format = "lll";
    } else {
      format = "LT";
    }
    return moment(createdAt).format(format);
  };

  return (
    <>
      {ownMessage ? (
        <Tooltip label={getTooltipTime()} placement={"left"}>
          <Flex
            flexDir={"column"}
            gap={2}
            alignSelf={"flex-end"}
            width={"fit-content"}
          >
            {content && (
              <Text maxW={"350px"} bg={"blue.400"} p={2} borderRadius={"md"}>
                {content}
              </Text>
            )}
            {file?._id && <FileMsg file={file} />}
          </Flex>
        </Tooltip>
      ) : (
        <Tooltip label={getTooltipTime()} placement={"right"}>
          <Flex gap={2} width={"fit-content"}>
            <Avatar src={participant?.avatar} w={"32px"} h={"32px"} />
            {content && (
              <Text
                maxW={"350px"}
                bg={"gray.400"}
                py={1}
                px={2}
                ml={1}
                borderRadius={"md"}
                color={"black"}
              >
                {content}
              </Text>
            )}
            {file?._id && <FileMsg file={file} />}
          </Flex>
        </Tooltip>
      )}
    </>
  );
};

export default Message;

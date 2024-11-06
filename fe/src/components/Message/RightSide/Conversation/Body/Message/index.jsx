import { Avatar, Flex, Text, Tooltip, Link } from "@chakra-ui/react";
import moment from "moment";
import { useSelector } from "react-redux";
import { isDifferentDate } from "../../../../../../util";
import FileMsg from "./Files";
import { Constants } from "../../../../../../Breads-Shared/Constants";
import MsgMediaLayout from "./MediaLayout";

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

  const msgContent = () => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const contentArr = content
      ?.split(urlRegex)
      ?.filter((part) => !!part.trim());

    return (
      <>
        {!ownMessage && (
          <Avatar src={participant?.avatar} w={"32px"} h={"32px"} />
        )}
        {content?.trim() && (
          <Text
            maxW={"350px"}
            bg={ownMessage ? "blue.400" : "gray.400"}
            py={ownMessage ? 2 : 1}
            px={2}
            ml={ownMessage ? 0 : 1}
            borderRadius={"md"}
            color={ownMessage ? "white" : "black"}
          >
            {contentArr.map((part, index) => {
              if (part.match(urlRegex)) {
                return (
                  <span key={index} style={{ marginRight: "4px" }}>
                    <Link
                      href={part}
                      color={ownMessage ? "white" : "black"}
                      isExternal
                      _hover={{ textDecoration: "underline" }}
                      _focus={{ boxShadow: "none" }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {part}
                    </Link>
                  </span>
                );
              }
              return <span key={index}>{part}</span>;
            })}
          </Text>
        )}
        {media?.length > 0 && <MsgMediaLayout media={media} />}
        {file?._id && <FileMsg file={file} />}
      </>
    );
  };

  return (
    <>
      <Tooltip
        label={getTooltipTime()}
        placement={ownMessage ? "left" : "right"}
      >
        <Flex
          flexDir={ownMessage ? "column" : ""}
          gap={2}
          alignSelf={ownMessage ? "flex-end" : "flex-start"}
          width={"fit-content"}
        >
          {msgContent()}
        </Flex>
      </Tooltip>
    </>
  );
};

export default Message;

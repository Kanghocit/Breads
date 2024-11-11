import { Avatar, Flex, Link, Text, Tooltip } from "@chakra-ui/react";
import moment from "moment";
import { useState } from "react";
import { useSelector } from "react-redux";
import { isDifferentDate } from "../../../../../../util";
import CustomLinkPreview from "../../../../../../util/CustomLinkPreview";
import MessageAction from "./Actions";
import FileMsg from "./Files";
import MsgMediaLayout from "./MediaLayout";
import MessageReactsBox from "./ReactsBox";

const Message = ({ msg }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const participant = useSelector(
    (state) => state.message.selectedConversation?.participant
  );
  const [displayAction, setDisplayAction] = useState(false);
  const ownMessage = msg?.sender === userInfo?._id;
  const { content, createdAt, file, media, links, reacts } = msg;
  const previousReact = reacts?.find(
    ({ userId }) => userId === userInfo?._id
  )?.react;

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

    const reactBox = () => {
      return (
        <div
          style={{
            position: "absolute",
            right: ownMessage ? "" : "-16px",
            bottom: "-10px",
            left: ownMessage ? "-16px" : "",
          }}
        >
          <MessageReactsBox reacts={reacts} msgId={msg?._id} />
        </div>
      );
    };

    return (
      <Flex
        id={`msg_${msg?._id}`}
        width={"fit-content"}
        alignItems={"center"}
        pos={"relative"}
      >
        {ownMessage && displayAction && (
          <MessageAction
            ownMsg={ownMessage}
            msgId={msg?._id}
            previousReact={previousReact}
          />
        )}
        {!ownMessage && (
          <Avatar
            src={participant?.avatar}
            w={"32px"}
            h={"32px"}
            mr={ownMessage ? 0 : 2}
          />
        )}
        <Flex
          flexDir={"column"}
          alignItems={ownMessage ? "flex-end" : "flex-start"}
        >
          {content?.trim() && (
            <Text
              pos={"relative"}
              maxW={"350px"}
              bg={ownMessage ? "blue.400" : "gray.400"}
              py={1}
              px={2}
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
              {reacts?.length > 0 &&
                !links?.length &&
                !media?.length &&
                !file?._id && <>{reactBox()}</>}
            </Text>
          )}
          {links?.length > 0 && (
            <div
              style={{
                position: "relative",
              }}
            >
              <CustomLinkPreview link={links[links?.length - 1]} />
              {msg?.reacts?.length > 0 && !media?.length && !file?._id && (
                <>{reactBox()}</>
              )}
            </div>
          )}
          {media?.length > 0 && <MsgMediaLayout media={media} />}
          {file?._id && <FileMsg file={file} />}
        </Flex>
        {!ownMessage && displayAction && (
          <MessageAction
            ownMsg={ownMessage}
            msgId={msg?._id}
            previousReact={previousReact}
          />
        )}
      </Flex>
    );
  };

  return (
    <>
      <Tooltip
        label={getTooltipTime()}
        placement={ownMessage ? "left" : "right"}
      >
        <Flex
          pos={"relative"}
          flexDir={ownMessage ? "column" : ""}
          gap={2}
          alignSelf={ownMessage ? "flex-end" : "flex-start"}
          width={"fit-content"}
          onMouseEnter={() => {
            setDisplayAction(true);
          }}
          onMouseLeave={() => {
            setDisplayAction(false);
          }}
        >
          {msgContent()}
        </Flex>
      </Tooltip>
    </>
  );
};

export default Message;

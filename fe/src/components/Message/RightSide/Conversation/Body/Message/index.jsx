import { Avatar, Flex, Image, Link, Text, Tooltip } from "@chakra-ui/react";
import moment from "moment";
import { useState } from "react";
import { useSelector } from "react-redux";
import { isDifferentDate } from "../../../../../../util";
import CustomLinkPreview from "../../../../../../util/CustomLinkPreview";
import { getCurrentTheme } from "../../../../../../util/Themes";
import { messageThemes } from "../../../../../../util/Themes/index";
import MessageAction from "./Actions";
import FileMsg from "./Files";
import MsgMediaLayout from "./MediaLayout";
import MessageReactsBox from "./ReactsBox";

const Message = ({ msg }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const participant = selectedConversation?.participant;
  const [displayAction, setDisplayAction] = useState(false);
  const ownMessage = msg?.sender === userInfo?._id;
  const { content, createdAt, file, media, links, reacts } = msg;
  const previousReact = reacts?.find(
    ({ userId }) => userId === userInfo?._id
  )?.react;
  const { user1Message, user2Message } = getCurrentTheme(
    selectedConversation?.theme
  );
  const {
    backgroundColor: msgBg,
    color: msgColor,
    borderColor,
  } = ownMessage ? user1Message : user2Message;

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
            zIndex: 1000,
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
              bg={msgBg}
              py={1}
              px={2}
              borderRadius={"md"}
              color={msgColor}
              border={borderColor ? `1px solid ${borderColor}` : ""}
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
              <CustomLinkPreview
                link={links[links?.length - 1]}
                bg={msgBg}
                color={msgColor}
                borderColor={borderColor}
              />
              {msg?.reacts?.length > 0 && !media?.length && !file?._id && (
                <>{reactBox()}</>
              )}
            </div>
          )}
          {media?.length > 0 && <MsgMediaLayout media={media} />}
          {file?._id && <FileMsg file={file} bg={msgBg} color={msgColor} />}
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

  const handleSettingMsg = () => {
    const splitArr = msg?.content.split(" ");
    const lastWord = splitArr[splitArr.length - 1];
    const isTheme = lastWord in messageThemes;
    const bgImg =
      messageThemes?.[lastWord]?.conversationBackground?.backgroundImage;

    return (
      <>
        <Text textAlign={"center"}>
          {ownMessage ? "You " : participant?.username + " "}
          {msg?.content}
        </Text>
        {isTheme && (
          <Image
            src={bgImg}
            width={"20px"}
            height={"20px"}
            borderRadius={"50%"}
          />
        )}
      </>
    );
  };

  return (
    <>
      <Tooltip
        label={getTooltipTime()}
        placement={ownMessage ? "left" : "right"}
      >
        {msg?.type === "setting" ? (
          <Flex
            _id={`msg_${msg?._id}`}
            width={"100%"}
            height={"fit-content"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={1}
          >
            {handleSettingMsg()}
          </Flex>
        ) : (
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
        )}
      </Tooltip>
    </>
  );
};

export default Message;

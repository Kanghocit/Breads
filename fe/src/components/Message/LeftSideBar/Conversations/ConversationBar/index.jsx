import {
  Avatar,
  AvatarBadge,
  Flex,
  Image,
  Stack,
  Text,
  useBreakpointValue,
  WrapItem,
} from "@chakra-ui/react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { selectConversation } from "../../../../../store/MessageSlice";

const ConversationBar = ({ conversation, onSelect }) => {
  const dispatch = useDispatch();
  const { _id, emoji, updatedAt, lastMsg, participant } = conversation;
  const userInfo = useSelector((state) => state.user.userInfo);
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleLastMsgInfo = () => {
    const isCurrentUser = lastMsg?.sender === userInfo._id;
    const userPrefix = isCurrentUser ? "You" : participant?.username;
    const msgContent = lastMsg?.content?.trim()
      ? lastMsg.content?.trim()
      : lastMsg?.file?._id
      ? "Send a file to you"
      : lastMsg?.media?.length
      ? "Send media to you"
      : "";
    const maxWidth = isMobile ? "145px" : "100px";
    const marginBottom = isMobile ? "5px" : "0px";
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          marginBottom: marginBottom,
        }}
      >
        <span
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            maxWidth: maxWidth,
            flexGrow: 1,
          }}
        >
          {userPrefix + ": " + msgContent}
        </span>
        <span
          style={{
            flexShrink: 0,
            whiteSpace: "nowrap",
            marginLeft: "8px",
            minWidth: "50px",
          }}
        >
          {" • " + moment(updatedAt).fromNow(true)}
        </span>
      </div>
    );
  };

  const handleClickConversation = () => {
    if (_id && selectedConversation?._id !== _id) {
      dispatch(selectConversation(conversation));
      const newPath = `/chat/${conversation?._id}`;
      history.pushState(null, "", newPath);
      const hiddenChatLayer = document.getElementById("chat-hidden-layer");
      if (onSelect) {
        onSelect(conversation);
      }
      if (hiddenChatLayer) {
        hiddenChatLayer.style.opacity = 1;
        hiddenChatLayer.style.visibility = "visible";
      }
    }
  };

  return (
    <Flex
      id={`conversation_${conversation?._id}`}
      gap={4}
      alignItems={"center"}
      p={2}
      _hover={{
        cursor: "pointer",
        bg: "gray",
        color: "white",
      }}
      bg={_id === selectedConversation?._id ? "gray" : ""}
      borderRadius={"md"}
      onClick={() => {
        handleClickConversation();
      }}
    >
      <WrapItem>
        <Avatar
          size={{ base: "md", sm: "sm", md: "md" }}
          src={participant?.avatar}
        >
          <AvatarBadge boxSize={"1em"} bg={"green.500"} />
        </Avatar>
      </WrapItem>
      <Stack direction={"column"} fontSize={isMobile ? "md" : "sm"}>
        <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
          {participant?.username}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
        <Text
          fontSize={isMobile ? "md" : "xs"}
          display={"flex"}
          alignItems={"center"}
          gap={1}
          maxWidth={"100%"}
        >
          {handleLastMsgInfo()}
        </Text>
      </Stack>
    </Flex>
  );
};

export default ConversationBar;

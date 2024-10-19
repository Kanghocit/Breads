import {
  Avatar,
  AvatarBadge,
  Flex,
  Image,
  Stack,
  Text,
  useColorModeValue,
  WrapItem,
} from "@chakra-ui/react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { selectConversation } from "../../../../../store/MessageSlice";

const ConversationBar = ({ conversation }) => {
  const dispatch = useDispatch();
  const { _id, emoji, updatedAt, lastMsg, participant } = conversation;
  const userInfo = useSelector((state) => state.user.userInfo);
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );

  const handleLastMsgInfo = () => {
    const isCurrentUser = lastMsg?.sender === userInfo._id;
    const userPrefix = isCurrentUser ? "You" : participant?.username;
    return (
      userPrefix +
      ": " +
      lastMsg?.content +
      " • " +
      moment(updatedAt).fromNow(true)
    );
  };

  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={2}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.600"),
        color: "white",
      }}
      borderRadius={"md"}
      onClick={() => {
        if (_id && selectedConversation?._id !== _id) {
          dispatch(selectConversation(conversation));
        }
      }}
    >
      <WrapItem>
        <Avatar
          size={{ base: "xs", sm: "sm", md: "md" }}
          src={participant?.avatar}
        >
          <AvatarBadge boxSize={"1em"} bg={"green.500"} />
        </Avatar>
      </WrapItem>
      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
          {participant?.username}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
        <Text
          fontSize={"xs"}
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

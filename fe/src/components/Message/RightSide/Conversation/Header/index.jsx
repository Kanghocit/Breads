import { Avatar, Flex, Image, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const ConversationHeader = () => {
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const participant = selectedConversation?.participant;

  return (
    <Flex w={"full"} h={12} alignItems={"center"} gap={2} p={2}>
      <Avatar src={participant?.avatar} size={"sm"} />
      <Text display={"flex"} alignItems={"center"}>
        {participant?.username} <Image src="/verified.png" w={4} h={4} ml={1} />
      </Text>
    </Flex>
  );
};

export default ConversationHeader;

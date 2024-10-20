import { Avatar, Container, Flex, Image, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { InfoIcon } from "@chakra-ui/icons";

const ConversationHeader = ({ openDetailTab, setOpenDetailTab }) => {
  const navigate = useNavigate();
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const participant = selectedConversation?.participant;

  return (
    <Flex
      w={"full"}
      p={1}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Flex
        width={"fit-content"}
        h={12}
        alignItems={"center"}
        gap={2}
        px={2}
        cursor={"pointer"}
        onClick={() => {
          navigate(`/users/${participant?._id}`);
        }}
      >
        <Avatar src={participant?.avatar} size={"sm"} />
        <Text display={"flex"} alignItems={"center"}>
          {participant?.username}{" "}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
      </Flex>
      <InfoIcon
        mr={5}
        width={"20px"}
        height={"20px"}
        cursor={"pointer"}
        onClick={() => {
          setOpenDetailTab(!openDetailTab);
        }}
      />
    </Flex>
  );
};

export default ConversationHeader;

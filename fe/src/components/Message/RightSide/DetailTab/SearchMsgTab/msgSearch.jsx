import { Avatar, Container, Flex, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { formatItemDate } from "../../../../../util";

const MessageSearchItem = ({ msg }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const participant = selectedConversation?.participant;
  const isOwnMsg = msg?.sender === userInfo?._id;
  const userData = isOwnMsg ? userInfo : participant;
  const currentYear = new Date().getFullYear();
  const msgYear = new Date(msg?.createdAt).getFullYear();

  return (
    <Container
      position={"relative"}
      margin={0}
      p={2}
      border={"1px solid gray"}
      borderRadius={4}
      width={"100%"}
      cursor={"pointer"}
      _hover={{
        bg: "gray",
      }}
      overflowX={"hidden"}
    >
      <Flex gap={2} alignItems={"center"}>
        <Avatar src={userData?.avatar} size={"sm"} />
        <Flex
          flexDir={"column"}
          justifyContent={"center"}
          textOverflow={"ellipsis"}
          whiteSpace={"nowrap"}
          overflow={"hidden"}
          maxW={currentYear === msgYear ? "60%" : "50%"}
        >
          <Text fontSize={"14px"} fontWeight={600}>
            {userData?.username}
          </Text>
          <Text fontSize={"11px"} fontWeight={400}>
            {msg?.content}
          </Text>
        </Flex>
      </Flex>
      <Text
        position={"absolute"}
        bottom={"8px"}
        right={"12px"}
        fontSize={"11px"}
      >
        {formatItemDate(msg?.createdAt)}
      </Text>
    </Container>
  );
};

export default MessageSearchItem;

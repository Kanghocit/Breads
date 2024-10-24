import { Avatar, Flex, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import FilesMsg from "./Files";

const Message = ({ msg }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const participant = useSelector(
    (state) => state.message.selectedConversation?.participant
  );
  const ownMessage = msg?.sender === userInfo?._id;
  const { content, createdAt, files, media } = msg;

  return (
    <>
      {ownMessage ? (
        <Flex flexDir={"column"} gap={2} alignSelf={"flex-end"}>
          {content && (
            <Text
              maxW={"350px"}
              bg={"blue.400"}
              p={2}
              mr={2}
              borderRadius={"md"}
            >
              {content}
            </Text>
          )}
          {files?.length > 0 && <FilesMsg files={files} />}
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar src={participant?.avatar} w={7} h={7} />
          {content && (
            <Text
              maxW={"350px"}
              bg={"gray.400"}
              p={2}
              ml={2}
              borderRadius={"md"}
              color={"black"}
            >
              {content}
            </Text>
          )}
          {files?.length > 0 && <FilesMsg files={files} />}
        </Flex>
      )}
    </>
  );
};

export default Message;

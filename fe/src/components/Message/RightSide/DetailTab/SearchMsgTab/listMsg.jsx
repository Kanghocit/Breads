import { Flex } from "@chakra-ui/react";
import MessageSearchItem from "./msgSearch";

const MessagesSearch = ({ msgs }) => {
  return (
    <Flex flexDir={"column"} gap={2} width={"100%"} overflowY={"hidden"}>
      {msgs?.map((msg) => (
        <MessageSearchItem _id={msg?._id} msg={msg} />
      ))}
    </Flex>
  );
};

export default MessagesSearch;

import { Flex } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import ConversationBar from "./ConversationBar";

const Conversations = () => {
  const conversations = useSelector((state) => state.message.conversations);

  return (
    <>
      {conversations?.length !== 0 && (
        <Flex flexDirection={"column"} gap={3} mt={2}>
          {conversations?.map((conversation) => (
            <ConversationBar
              key={conversation?._id}
              conversation={conversation}
            />
          ))}
        </Flex>
      )}
    </>
  );
};

export default Conversations;

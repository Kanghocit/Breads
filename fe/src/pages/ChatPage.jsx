import { Flex } from "@chakra-ui/react";
import LeftSideBarMsg from "../components/Message/LeftSideBar";
import RightSideMsg from "../components/Message/RightSide";

const ChatPage = () => {
  return (
    <Flex
      position={"absolute"}
      left={"55%"}
      w={{
        base: "100%",
        md: "80%",
        lg: "90%",
      }}
      pl={"24px"}
      pr={3}
      transform={"translateX(-50%)"}
      gap={"24px"}
    >
      <LeftSideBarMsg />
      <RightSideMsg />
    </Flex>
  );
};

export default ChatPage;

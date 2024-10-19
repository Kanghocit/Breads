import { SearchIcon } from "@chakra-ui/icons";
import { GiConversation } from "react-icons/gi";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import MessageContainer from "../components/Message/MessageContainer";
import Conversations from "../components/Message/Conversations";
import MessageRightBar from "../components/Message/MessageRightBar";
import { useState } from "react";
const ChatPage = () => {
  const [showRightBar, setShowRightBar] = useState(false);
  const bgColor = useColorModeValue("cbg.light", "cbg.dark");
  return (
    <Box
      position={"absolute"}
      left={"55%"}
      w={{
        base: "100%",
        md: "80%",
        lg: "90%",
      }}
      // pl={"100px"}
      pl={4}
      // pr={4}

      transform={"translateX(-50%)"}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxW={{
          sm: "440px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={25}
          gap={2}
          p={3}
          bg={bgColor}
          borderRadius={"10px"}
          flexDirection={"column"}
          maxW={{
            sm: "250px",
            mx: "auto",
          }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            {" "}
            Your conversations
          </Text>
          <form>
            <Flex alignItems={"center"} gap={2}>
              <Input placeholder="Search for a user" />
              <Button size={"sm"}>
                {" "}
                <SearchIcon />{" "}
              </Button>
            </Flex>
          </form>
          {false &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={"1"}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={10} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}
          <Conversations />
          <Conversations />
          <Conversations />
        </Flex>
        {/* <Flex
          flex={70}
          borderRadius={"md"}
          p={2}
          flexDir={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          height={"400px"}
        >
          <GiConversation size={100} />
          <Text fontSize={20}> Select a Conversation to start messaing</Text>
        </Flex> */}
        <MessageContainer setShowRightBar={setShowRightBar} />
        {showRightBar && (
          <Flex flex={25} >
            <MessageRightBar />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default ChatPage;

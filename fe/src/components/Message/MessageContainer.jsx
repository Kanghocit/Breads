import {
  Avatar,
  Divider,
  Flex,
  IconButton,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Message from "./Message";
import MessageInput from "./MessageBar";

const MessageContainer = ({ setShowRightBar }) => {
  return (
    <Flex
      flex={70}
      bg={useColorModeValue("gray.200", "#181818")}
      borderRadius={"md"}
      flexDirection={"column"}
      overflow={"hidden"}
      mr={3}
    >
      <Flex
        w={"full"}
        h={12}
        
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Flex gap={2} p={2} >
          <Avatar src="" size={"sm"} />
          <Text display={"flex"} alignItems={"center"}>
            Khang <Image src="/verified.png" w={4} h={4} ml={1} />
          </Text>
        </Flex>
        <Flex pr={1}>
          <IconButton
            icon={<BsThreeDots />}
            bg={"none"}
            onClick={() => setShowRightBar((prev) => !prev)} 
            aria-label="Options"
            borderRadius={"50%"}
          />
        </Flex>
      </Flex>
      <Divider />
      <Flex
        flexDir={"column"}
        gap={4}
        my={4}
        px={2}
        height={"460px"}
        overflowY={"auto"}
        p={2}
      >
        {false &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir={"column"} gap={2}>
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
          <Message ownMessage={index % 2 == 0} />
        ))}
      </Flex>
      <MessageInput />
     
    </Flex>
  );
};

export default MessageContainer;

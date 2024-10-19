import { Flex, Skeleton, SkeletonCircle } from "@chakra-ui/react";

const ConversationBody = () => {
  return (
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
      {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
          <Message ownMessage={index % 2 == 0} />
        ))} */}
    </Flex>
  );
};

export default ConversationBody;

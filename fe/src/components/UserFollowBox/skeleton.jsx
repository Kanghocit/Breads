import {
  Container,
  Flex,
  SkeletonCircle,
  SkeletonText,
  useColorModeValue,
} from "@chakra-ui/react";

const UserFollowBoxSkeleton = ({ inFollowBox = false }) => {
  const bgColor = useColorModeValue("cuse.light","cuse.dark");
  const textColor = useColorModeValue("ccl.light","ccl.dark");
  return (
    <Flex
      width={"100%"}
      height={"80px"}
      justifyContent={"space-between"}
      alignItems={"center"}
      bg={bgColor}
      padding={"0 12px"}
      borderRadius={inFollowBox ? "" : "10px"}
      mb={inFollowBox ? "" : "10px"}
      borderBottom={inFollowBox ? "1px solid gray" : ""}
    >
      <Flex alignItems={"center"}>
        <SkeletonCircle size={12} />
        <Container width={"fit-content"}>
          <SkeletonText
            mt="2"
            noOfLines={1}
            skeletonHeight="3"
            width={"80px"}
          />
          <SkeletonText
            mt="2"
            noOfLines={1}
            skeletonHeight="3"
            width={"140px"}
          />
        </Container>
      </Flex>
      <SkeletonText
        width={"80px"}
        noOfLines={1}
        skeletonHeight="9"
        borderRadius={"20px"}
      />
    </Flex>
  );
};

export default UserFollowBoxSkeleton;

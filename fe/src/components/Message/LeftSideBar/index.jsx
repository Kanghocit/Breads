import { SearchIcon } from "@chakra-ui/icons";
import { Button, Flex, Input, Text, useColorModeValue } from "@chakra-ui/react";
import Conversations from "./Conversations";

const LeftSideBarMsg = () => {
  return (
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
        flex={30}
        gap={2}
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
        <Conversations />
      </Flex>
    </Flex>
  );
};

export default LeftSideBarMsg;

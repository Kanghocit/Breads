import { SearchIcon } from "@chakra-ui/icons";
import { Button, Flex, Input, Text, useColorModeValue } from "@chakra-ui/react";
import Conversations from "./Conversations";
import { useState } from "react";

const LeftSideBarMsg = () => {
  const [searchValue, setSearchValue] = useState("");

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
      pr={3}
      mx={"auto"}
      maxHeight={`85vh`}
      overflowY={"scroll"}
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
            <Input
              placeholder="Search for a user"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button size={"sm"}>
              {" "}
              <SearchIcon />{" "}
            </Button>
          </Flex>
        </form>
        <Conversations
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </Flex>
    </Flex>
  );
};

export default LeftSideBarMsg;

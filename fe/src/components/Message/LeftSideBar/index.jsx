import { SearchIcon } from "@chakra-ui/icons";
import { Button, Flex, Input, Text, useColorModeValue } from "@chakra-ui/react";
import Conversations from "./Conversations";
import { useState } from "react";

const LeftSideBarMsg = ({onSelectConversation }) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <Flex
      gap={4}
      flexDirection={{
        base: "column",
        md: "row",
      }}
      width={{
        base: "100%", 
        md: "full", 
      }}
      maxW={{
        md: "full",
      }}
      pr={{ base: 0, md: 3 }}
      mx={"auto"}
      maxHeight={`85vh`}
      overflowY={"scroll"}
    >
      <Flex
        flex={30}
        gap={2}
        flexDirection={"column"}
        width={{
          base: "100%", 
          md: "250px", 
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
              <SearchIcon />{" "}
            </Button>
          </Flex>
        </form>
        <Conversations
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onSelect={onSelectConversation} 
        />
      </Flex>
    </Flex>
  );
};

export default LeftSideBarMsg;

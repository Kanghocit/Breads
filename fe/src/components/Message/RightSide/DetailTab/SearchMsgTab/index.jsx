import { SearchIcon } from "@chakra-ui/icons";
import { Button, Container, Flex, Input } from "@chakra-ui/react";
import { useState } from "react";
import ConversationTabHeader from "../tabHeader";

const ConversationSearchTab = ({ setItemSelected }) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <Container margin={0} padding={2} height={"70vh"} overflowY={"auto"}>
      <ConversationTabHeader setItemSelected={setItemSelected} />
      <Flex alignItems={"center"} gap={2}>
        <Input
          placeholder="Search a message"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button size={"sm"}>
          {" "}
          <SearchIcon />{" "}
        </Button>
      </Flex>
    </Container>
  );
};

export default ConversationSearchTab;

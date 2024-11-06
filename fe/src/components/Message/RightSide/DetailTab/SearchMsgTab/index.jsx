import { Container, Flex, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MESSAGE_PATH, Route } from "../../../../../Breads-Shared/APIConfig";
import { POST } from "../../../../../config/API";
import useDebounce from "../../../../../hooks/useDebounce";
import ConversationTabHeader from "../tabHeader";
import MessagesSearch from "./listMsg";

const ConversationSearchTab = ({ setItemSelected }) => {
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const debounceValue = useDebounce(searchValue);

  useEffect(() => {
    if (debounceValue.trim()) {
      handleSearch();
    }
  }, [debounceValue]);

  const handleSearch = async () => {
    try {
      const data = await POST({
        path: Route.MESSAGE + MESSAGE_PATH.SEARCH,
        payload: {
          conversationId: selectedConversation?._id,
          value: debounceValue,
        },
      });
      setData(data);
    } catch (err) {
      console.error("handleSearch: ", err);
      setData([]);
    }
  };

  return (
    <Container margin={0} padding={2} height={"70vh"} overflowY={"auto"}>
      <ConversationTabHeader setItemSelected={setItemSelected} />
      <Flex alignItems={"center"} gap={4} flexDir={"column"} px={2}>
        <Input
          placeholder="Search a message"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <MessagesSearch msgs={data} />
        {/* <Button size={"sm"}>
          {" "}
          <SearchIcon />{" "}
        </Button> */}
      </Flex>
    </Container>
  );
};

export default ConversationSearchTab;

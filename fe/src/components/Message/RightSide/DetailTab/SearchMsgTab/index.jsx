import { Container, Flex, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MESSAGE_PATH, Route } from "../../../../../Breads-Shared/APIConfig";
import { POST } from "../../../../../config/API";
import useDebounce from "../../../../../hooks/useDebounce";
import { updateHasMoreData } from "../../../../../store/UtilSlice";
import InfiniteScroll from "../../../../InfiniteScroll";
import ConversationTabHeader from "../tabHeader";
import MessageSearchItem from "./msgSearch";
import { EmptyContentSvg } from "../../../../../assests/icons";

const ConversationSearchTab = ({ setItemSelected }) => {
  const dispatch = useDispatch();
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const debounceValue = useDebounce(searchValue);

  useEffect(() => {
    if (debounceValue.trim()) {
      handleSearch({ page: 1 });
    }
  }, [debounceValue]);

  const handleSearch = async ({ page }) => {
    try {
      const data = await POST({
        path: Route.MESSAGE + MESSAGE_PATH.SEARCH,
        payload: {
          conversationId: selectedConversation?._id,
          value: debounceValue,
          page: page,
          limit: 15,
        },
      });
      if (page === 1) {
        setData(data);
      } else {
        if (data?.length) {
          setData((prev) => [...prev, ...data]);
        } else {
          dispatch(updateHasMoreData(false));
        }
      }
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
        {data?.length > 0 ? (
          <Flex flexDir={"column"} gap={2} width={"100%"} overflowY={"hidden"}>
            <InfiniteScroll
              queryFc={(page) => {
                handleSearch({ page: page });
              }}
              data={data}
              cpnFc={(msg) => <MessageSearchItem msg={msg} />}
              condition={debounceValue.trim()}
              reloadPageDeps={[debounceValue]}
              prefixId="search_msg"
            />
          </Flex>
        ) : (
          <EmptyContentSvg />
        )}
      </Flex>
    </Container>
  );
};

export default ConversationSearchTab;

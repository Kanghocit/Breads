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
import { useEffect, useRef, useState } from "react";
import { GET } from "../config/API"; // Assuming you have a GET method defined to fetch users
import { Route, USER_PATH } from "../Breads-Shared/APIConfig";
import { useSelector } from "react-redux";

const ChatPage = () => {
  const bgColor = useColorModeValue("cbg.light", "cbg.dark");
  const userInfo = useSelector((state) => state.user.userInfo);
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const init = useRef(true);
  const [showRightBar, setShowRightBar] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!init.current && searchValue) {
      handleGetUsers({
        page: 1,
        searchValue,
        isFetchMore: false,
      });
    }
    init.current = false;
  }, [searchValue]);

  const handleGetUsers = async ({
    page,
    searchValue,
    isFetchMore,
    setHasMore = null,
  }) => {
    try {
      const data = await GET({
        path: Route.USER + USER_PATH.USERS_TO_FOLLOW,
        params: {
          userId: userInfo._id,
          page: page,
          limit: 8,
          searchValue,
        },
      });
      if (data.length > 0) {
        if (isFetchMore) {
          setUsers((prevUsers) => [...prevUsers, ...data]);
        } else {
          setUsers(data);
        }
      } else {
        // setHasMore && setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    }
  };
  
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
              <Input
                placeholder="Search for a user"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </Flex>
          </form>

          {searchValue.length > 0 && users.length > 0 ? (
            users.map((user) => (
              <Conversations key={user._id} user={user} />
            ))
          ) : searchValue.length > 0 ? (
            <Text>No users found</Text>
          ) : null}

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
             {}

          {/* <Conversations />
          <Conversations />
          <Conversations /> */}
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
          <Flex flex={25}>
            <MessageRightBar />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default ChatPage;
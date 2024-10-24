import { Flex } from "@chakra-ui/react";
import LeftSideBarMsg from "../components/Message/LeftSideBar";
import RightSideMsg from "../components/Message/RightSide";

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
    <Flex
      position={"absolute"}
      left={"55%"}
      w={{
        base: "100%",
        md: "80%",
        lg: "90%",
      }}
      pl={"24px"}
      pr={3}
      transform={"translateX(-50%)"}
      gap={"24px"}
    >
      <LeftSideBarMsg />
      <RightSideMsg />
    </Flex>
  );
};

export default ChatPage;
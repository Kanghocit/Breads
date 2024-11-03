import { Container, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, USER_PATH } from "../Breads-Shared/APIConfig";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import InfiniteScroll from "../components/InfiniteScroll";
import ContainerLayout from "../components/MainBoxLayout";
import SearchBar from "../components/SearchBar";
import UserFollowBox from "../components/UserFollowBox";
import UserFollowBoxSkeleton from "../components/UserFollowBox/skeleton";
import { GET } from "../config/API";
import { changePage } from "../store/UtilSlice/asyncThunk";

const SearchPage = () => {
  const dispatch = useDispatch();
  const bgColor = useColorModeValue("cbg.light", "cbg.dark");
  const textColor = useColorModeValue("ccl.light", "ccl.dark");
  const userInfo = useSelector((state) => state.user.userInfo);
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const init = useRef(true);

  useEffect(() => {
    if (!init.current) {
      handleGetUsers({
        page: 1,
        searchValue,
        isFetchMore: false,
      });
    }
    if (init.current) {
      dispatch(changePage({ nextPage: PageConstant.SEARCH }));
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
          limit: 20,
          searchValue,
        },
      });
      if (data.length > 0) {
        if (isFetchMore) {
          setUsers([...users, ...data]);
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
    <>
      <ContainerLayout>
        <Container
          width="100%"
          maxWidth={"100%"}
          height={"40px"}
          borderRadius={"12px"}
          bg={bgColor}
          margin={0}
          marginBottom={"12px"}
          padding={0}
        >
          <SearchBar
            value={searchValue}
            setValue={setSearchValue}
            placeholder={"Tìm kiếm"}
          />
        </Container>
        <Text
          color={"gray"}
          fontWeight={"500"}
          mb={"12px"}
          position={"relative"}
          left={"4px"}
        >
          Gợi ý theo dõi
        </Text>
        <InfiniteScroll
          queryFc={(page, setHasMore) => {
            handleGetUsers({
              page,
              searchValue,
              isFetchMore: true,
              setHasMore,
            });
          }}
          data={users}
          cpnFc={(user) => <UserFollowBox user={user} />}
          condition={!!userInfo._id}
          deps={[userInfo._id]}
          skeletonCpn={<UserFollowBoxSkeleton />}
        />
      </ContainerLayout>
    </>
  );
};

export default SearchPage;

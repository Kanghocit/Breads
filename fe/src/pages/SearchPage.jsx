import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ContainerLayout from "../components/MainBoxLayout";
import UserFollowBox from "../components/UserFollowBox";
import { GET } from "../config/API";
import { Route, USER_PATH } from "../Breads-Shared/APIConfig";
import { Container, Input, Text } from "@chakra-ui/react";
import SearchBar from "../components/SearchBar";

const SearchPage = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const init = useRef(true);

  useEffect(() => {
    if (userInfo._id) {
      handleGetUsers(page, searchValue, true);
    }
  }, [userInfo._id, page]);

  useEffect(() => {
    if (!init.current) {
      handleGetUsers(1, searchValue, false);
    }
    init.current = false;
  }, [searchValue]);

  const handleGetUsers = async (page, searchValue, isFetchMore) => {
    try {
      setLoading(true);
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
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const lastUserElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <>
      <ContainerLayout>
        <Container
          width="100%"
          maxWidth={"100%"}
          height={"40px"}
          borderRadius={"12px"}
          bg={"white"}
          margin={0}
          marginBottom={"12px"}
          padding={0}
        >
          <SearchBar
            value={searchValue}
            setValue={setSearchValue}
            placeholder={"Search"}
          />
        </Container>
        <Text
          color={"gray"}
          fontWeight={"500"}
          mb={"12px"}
          position={"relative"}
          left={"4px"}
        >
          Suggested to follow
        </Text>
        {users?.map((user, index) => {
          if (index + 1 < users.length) {
            return <UserFollowBox userInfo={user} />;
          } else {
            return (
              <div ref={lastUserElementRef}>
                <UserFollowBox userInfo={user} />
              </div>
            );
          }
        })}
      </ContainerLayout>
    </>
  );
};

export default SearchPage;

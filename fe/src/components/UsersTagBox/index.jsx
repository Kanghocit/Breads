import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, USER_PATH } from "../../Breads-Shared/APIConfig";
import { GET } from "../../config/API";
import useDebounce from "../../hooks/useDebounce";
import { updateHasMoreData } from "../../store/UtilSlice";
import InfiniteScroll from "../InfiniteScroll";
import UserBox from "../UserFollowBox/UserBox";
import UserBoxSekeleton from "../UserFollowBox/UserBox/skeleton";
import { Flex, Spinner, Text } from "@chakra-ui/react";

const UsersTagBox = ({ searchValue, setOpenTagBox }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const hasMoreData = useSelector((state) => state.util.hasMoreData);
  const [users, setUsers] = useState([]);
  const debounceValue = useDebounce(searchValue, 500);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUsers([]);
    setIsLoading(true);
  }, [searchValue]);

  const handleGetUsersTag = async ({ page }) => {
    try {
      if (!!searchValue?.trim()) {
        const data = await GET({
          path: Route.USER + USER_PATH.USERS_TO_TAG,
          params: {
            userId: userInfo._id,
            page: page,
            limit: 10,
            searchValue: debounceValue,
          },
        });
        setUsers([...users, ...data]);
        setIsLoading(false);
        if (data?.length > 0) {
          if (!hasMoreData) {
            dispatch(updateHasMoreData(true));
          }
        } else {
          dispatch(updateHasMoreData(false));
        }
      }
    } catch (err) {
      console.error("UsersTagBox: ", err);
    }
  };

  return (
    <>
      {isLoading && (
        <Flex
          justifyContent={"center"}
          width={"100%"}
          height={"100%"}
          padding={"6px"}
        >
          <Spinner size="sm" />
        </Flex>
      )}
      <InfiniteScroll
        queryFc={(page) => {
          handleGetUsersTag({ page });
        }}
        data={users}
        cpnFc={(user) => (
          <UserBox
            user={user}
            isTagBox={true}
            setOpenTagBox={setOpenTagBox}
            searchValue={debounceValue}
          />
        )}
        condition={!!userInfo._id}
        deps={[userInfo._id, debounceValue]}
        skeletonCpn={<UserBoxSekeleton smallAvatar={true} />}
        reloadPageDeps={[debounceValue]}
      />
      {users?.length === 0 && !isLoading && (
        <Text textAlign={"center"}>There is no user</Text>
      )}
    </>
  );
};

export default memo(UsersTagBox);

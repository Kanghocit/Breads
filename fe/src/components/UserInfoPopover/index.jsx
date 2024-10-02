import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import PageConstant from "../../../../share/Constants/PageConstants";
import useShowToast from "../../hooks/useShowToast";
import { changePage } from "../../store/UtilSlice";
import { handleFlow } from "../FollowBtn";

const UserInfoPopover = ({ user, content = "" }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const isFollowing = userInfo?.following?.includes(user?._id);
  const showToast = useShowToast();

  const handleGoToUserPage = () => {
    dispatch(changePage({ nextPage: PageConstant.USER }));
  };

  return (
    <Popover trigger="hover" placement="bottom-start">
      <PopoverTrigger>
        <Link
          as={RouterLink}
          to={`/users/${user._id}`}
          onClick={() => handleGoToUserPage()}
        >
          <Text
            fontSize={"sm"}
            fontWeight={"bold"}
            cursor={"pointer"}
            _hover={{ textDecoration: "underline" }}
          >
            {user?.username}
          </Text>
        </Link>
      </PopoverTrigger>

      <PopoverContent
        position="absolute"
        top="-1"
        left="-7"
        transform="translateX(-50%)"
        borderRadius={"10px"}
      >
        <PopoverBody bg={"white"} color={"black"} borderRadius={"10px"}>
          <Box m={2}>
            <Flex justifyContent={"space-between"}>
              <Text fontWeight="bold">{user.username}</Text>
              <Avatar
                src={user?.avatar}
                size={"md"}
                name={user?.username}
                cursor={"pointer"}
              />
            </Flex>
            <Text fontSize={"sm"}> {user.name}</Text>
            {content && <Text>{content}</Text>}
            <Text color={"gray.400"}>
              {user?.followed?.length || 0} người theo dõi
            </Text>
            <Button
              w={"100%"}
              bg={"black"}
              color={"white"}
              mt={"8px"}
              _hover={{ opacity: 0.8 }}
              _active={{ opacity: 0.6 }}
              transition="opacity 0.2s"
              onClick={() => handleFlow(userInfo, user, dispatch, showToast)}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default UserInfoPopover;

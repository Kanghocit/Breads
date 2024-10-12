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
  useColorMode,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import PageConstant from "../../Breads-Shared/Constants/PageConstants";
import useShowToast from "../../hooks/useShowToast";
import { changePage } from "../../store/UtilSlice";
import { handleFlow } from "../FollowBtn";
import { useState } from "react";
import UnFollowPopup from "../FollowBtn/UnfollowPopup";

const UserInfoPopover = ({ user, content = "" }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);

  const isFollowing = userInfo?.following?.includes(user?._id);
  const showToast = useShowToast();
  const [openCancelPopup, setOpenCancelPopup] = useState(false);
  const { colorMode } = useColorMode();
  const handleGoToUserPage = () => {
    dispatch(changePage({ nextPage: PageConstant.USER }));
  };

  return (
    <Popover trigger="hover" placement="bottom-start">
      <PopoverTrigger>
        <Link
          as={RouterLink}
          to={`/users/${user?._id}`}
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
        <PopoverBody
          bg={colorMode === "dark" ? "#0a0a0a" : "#fafafa"}
          color={colorMode === "dark" ? "white" : "black"}
          borderRadius={"10px"}
        >
          <Box m={2}>
            <Flex justifyContent={"space-between"} pb={4}>
              <Box>
                <Text fontWeight="bold">{user?.username}</Text>
                <Text fontSize={"sm"}>{userInfo?.name}</Text>
              </Box>
              <Avatar
                src={user?.avatar}
                size={"md"}
                name={user?.username}
                cursor={"pointer"}
              />
            </Flex>
            <Text fontSize={"sm"}> {userInfo?.bio}</Text>
            <Text color={"gray.400"}>
              {user?.followed?.length || 0} người theo dõi
            </Text>
            {user?._id !== userInfo?._id && (
              <Button
                w={"100%"}
                bg={colorMode === "dark" ? "#fafafa" : "#0a0a0a"}
                color={colorMode === "dark" ? "black" : "white"}
                mt={"8px"}
                _hover={{ opacity: 0.8 }}
                _active={{ opacity: 0.6 }}
                transition="opacity 0.2s"
                onClick={() => {
                  if (isFollowing) {
                    setOpenCancelPopup(true);
                  } else {
                    handleFlow(userInfo, user, dispatch, showToast);
                  }
                }}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </Box>
        </PopoverBody>
      </PopoverContent>
      <UnFollowPopup
        user={user}
        isOpen={openCancelPopup}
        onClose={() => setOpenCancelPopup(false)}
        onClick={() => {
          handleFlow(userInfo, user, dispatch, showToast);
          setOpenCancelPopup(false);
        }}
      />
    </Popover>
  );
};

export default UserInfoPopover;

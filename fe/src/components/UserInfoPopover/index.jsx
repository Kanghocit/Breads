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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import PageConstant from "../../Breads-Shared/Constants/PageConstants";
import useShowToast from "../../hooks/useShowToast";
import { changePage } from "../../store/UtilSlice/asyncThunk";
import { handleFlow } from "../FollowBtn";
import UnFollowPopup from "../FollowBtn/UnfollowPopup";
import { selectUser } from "../../store/UserSlice";

export const UserInfoBox = ({ user }) => {
  const dispatch = useDispatch();
  const showToast = useShowToast();
  const [openCancelPopup, setOpenCancelPopup] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const isFollowing = userInfo?.following?.includes(user?._id);
  const { colorMode } = useColorMode();

  return (
    <PopoverBody
      bg={colorMode === "dark" ? "#0a0a0a" : "#fafafa"}
      color={colorMode === "dark" ? "white" : "black"}
      borderRadius={"10px"}
    >
      <Box m={2}>
        <Flex justifyContent={"space-between"} pb={4}>
          <Box>
            <Text fontWeight="bold">{user?.username}</Text>
            <Text fontSize={"sm"}>{user?.name}</Text>
          </Box>
          <Avatar
            src={user?.avatar}
            size={"md"}
            name={user?.username}
            cursor={"pointer"}
          />
        </Flex>
        <Text fontSize={"sm"}> {user?.bio}</Text>
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
      <UnFollowPopup
        user={user}
        isOpen={openCancelPopup}
        onClose={() => setOpenCancelPopup(false)}
        onClick={() => {
          handleFlow(userInfo, user, dispatch, showToast);
          setOpenCancelPopup(false);
        }}
      />
    </PopoverBody>
  );
};

const UserInfoPopover = ({ user, isParentPost = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, userSelected } = useSelector((state) => state.user);
  const currentPage = useSelector((state) => state.util.currentPage);
  const isFrPage = currentPage === PageConstant.FRIEND;

  const handleGoToUserPage = () => {
    navigate(`/users/${user._id}`);
    dispatch(
      changePage({
        nextPage:
          user?._id === userInfo?._id ? PageConstant.USER : PageConstant.FRIEND,
      })
    );
  };

  return (
    <Popover trigger="hover" placement="bottom-start">
      <PopoverTrigger>
        <Link
          as={RouterLink}
          to={`/users/${user?._id}`}
          onClick={() => handleGoToUserPage()}
          onMouseEnter={() => {
            if (userSelected?._id !== user?._id && !isFrPage) {
              dispatch(selectUser(user));
            }
          }}
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

      {!isParentPost &&
        (isFrPage
          ? userSelected?._id !== user?._id
          : userInfo?._id !== user?._id) && (
          <PopoverContent
            top="-1"
            left="-7"
            transform="translateX(-50%)"
            borderRadius={"10px"}
            zIndex={10000}
          >
            <UserInfoBox
              user={user?._id === userSelected?._id ? userSelected : user}
            />
          </PopoverContent>
        )}
    </Popover>
  );
};

export default UserInfoPopover;

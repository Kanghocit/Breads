import {
  Avatar,
  Container,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updatePostInfo } from "../../../store/PostSlice";
import UserInfoPopover from "../../UserInfoPopover";

const UserBox = ({
  user,
  isTagBox = false,
  setOpenTagBox = null,
  searchValue = "",
  inFollowBox = false,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bgColor = useColorModeValue("cuse.light", "cuse.dark");
  const textColor = useColorModeValue("ccl.light", "ccl.dark");
  const postInfo = useSelector((state) => state.post.postInfo);

  const getToUserPage = () => {
    navigate(`/users/${user._id}`);
  };

  const tagUser = () => {
    dispatch(
      updatePostInfo({
        ...postInfo,
        usersTag: [
          ...postInfo.usersTag,
          {
            searchValue: searchValue,
            username: user.username,
            userId: user._id,
          },
        ],
      })
    );
    setOpenTagBox(false);
  };

  return (
    <Flex
      bg={isTagBox ? bgColor : ""}
      alignItems={"center"}
      padding={isTagBox ? "2px 8px" : ""}
      borderRadius={isTagBox ? "6px" : ""}
      cursor={isTagBox ? "pointer" : ""}
      _hover={{
        opacity: isTagBox ? "0.8" : "",
      }}
      mb={isTagBox ? "4px" : ""}
      onClick={() => {
        if (isTagBox) {
          tagUser();
        }
      }}
    >
      <Avatar
        size={isTagBox ? "sm" : "md"}
        src={user.avatar}
        cursor={"pointer"}
        onClick={() => {
          if (!isTagBox) {
            getToUserPage();
          }
        }}
      />
      <Container>
        {!isTagBox && !inFollowBox ? (
          <UserInfoPopover user={user} />
        ) : (
          <Text
            fontSize={"sm"}
            fontWeight={"bold"}
            cursor={"pointer"}
            _hover={{
              textTransform: inFollowBox ? "underlined" : "",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (inFollowBox) {
                window.location.href =
                  window.location.origin + `/users/${user?._id}`;
              }
            }}
          >
            {user?.username}
          </Text>
        )}
        <Text
          fontWeight={"400"}
          fontSize={"14px"}
          cursor={isTagBox ? "pointer" : ""}
        >
          {user.name}
        </Text>
      </Container>
    </Flex>
  );
};

export default UserBox;

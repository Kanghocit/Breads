import { Avatar, Container, Flex, Text } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserInfoPopover from "../../UserInfoPopover";
import { useColorModeValue } from "@chakra-ui/react";

const UserBox = ({
  user,
  canNavigate = true,
  smallAvatar = false,
  displayHoverPopup = true,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bgColor = useColorModeValue("cuse.light", "cuse.dark");
  const textColor = useColorModeValue("ccl.light", "ccl.dark");

  const getToUserPage = () => {
    navigate(`/users/${userInfo._id}`);
    dispatch(changePage({ nextPage: PageConstant.USER }));
  };

  return (
    <Flex
      bg={bgColor}
      alignItems={"center"}
      padding={!displayHoverPopup ? "2px 8px" : ""}
      borderRadius={!displayHoverPopup ? "6px" : ""}
      cursor={!displayHoverPopup ? "pointer" : ""}
      _hover={{
        opacity: !displayHoverPopup ? "0.8" : "",
      }}
      mb={!displayHoverPopup ? "4px" : ""}
    >
      <Avatar
        size={smallAvatar ? "sm" : "md"}
        src={user.avatar}
        cursor={"pointer"}
        onClick={() => {
          if (canNavigate) {
            getToUserPage();
          }
        }}
      />
      <Container>
        {displayHoverPopup ? (
          <UserInfoPopover user={user} />
        ) : (
          <Text
            fontSize={"sm"}
            fontWeight={"bold"}
            cursor={!displayHoverPopup ? "pointer" : ""}
          >
            {user?.username}
          </Text>
        )}
        <Text
          fontWeight={"400"}
          fontSize={"14px"}
          cursor={!displayHoverPopup ? "pointer" : ""}
        >
          {user.name}
        </Text>
      </Container>
    </Flex>
  );
};

export default UserBox;

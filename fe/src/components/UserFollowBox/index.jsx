import { Avatar, Button, Container, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import UserInfoPopover from "../UserInfoPopover";
import { useDispatch } from "react-redux";
import { changePage } from "../../store/UtilSlice";
import PageConstant from "../../../../share/Constants/PageConstants";

const UserFollowBox = ({ userInfo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getToUserPage = () => {
    navigate(`/users/${userInfo._id}`);
    dispatch(changePage({ nextPage: PageConstant.USER }));
  };

  return (
    <Flex
      width={"100%"}
      height={"80px"}
      justifyContent={"space-between"}
      alignItems={"center"}
      bg="white"
      padding={"0 12px"}
      borderRadius={"10px"}
      mb={"10px"}
    >
      <Flex>
        <Avatar
          src={userInfo.avatar}
          cursor={"pointer"}
          onClick={() => getToUserPage()}
        />
        <Container>
          <UserInfoPopover userInfo={userInfo} />
          <Text fontWeight={"400"} fontSize={"14px"}>
            {userInfo.name}
          </Text>
        </Container>
      </Flex>
      <Button>Follow</Button>
    </Flex>
  );
};

export default UserFollowBox;

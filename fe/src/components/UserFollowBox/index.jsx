import { Avatar, Container, Flex, Text } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageConstant from "../../Breads-Shared/Constants/PageConstants";
import { changePage } from "../../store/UtilSlice";
import FollowBtn from "../FollowBtn";
import UserInfoPopover from "../UserInfoPopover";

const UserFollowBox = ({ userInfo, inFollowBox = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getToUserPage = () => {
    navigate(`/users/${userInfo._id}`);
    dispatch(changePage({ nextPage: PageConstant.USER }));
  };

  return (
    <>
      <Flex
        width={"100%"}
        height={"80px"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg="white"
        padding={"0 12px"}
        borderRadius={inFollowBox ? "" : "10px"}
        mb={inFollowBox ? "" : "10px"}
        borderBottom={inFollowBox ? "1px solid gray" : ""}
      >
        <Flex>
          <Avatar
            src={userInfo.avatar}
            cursor={"pointer"}
            onClick={() => getToUserPage()}
          />
          <Container>
            <UserInfoPopover user={userInfo} />
            <Text fontWeight={"400"} fontSize={"14px"}>
              {userInfo.name}
            </Text>
          </Container>
        </Flex>
        <FollowBtn user={userInfo} />
      </Flex>
    </>
  );
};

export default UserFollowBox;

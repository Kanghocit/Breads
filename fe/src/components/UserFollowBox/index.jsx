import { Flex, useColorModeValue } from "@chakra-ui/react";
import FollowBtn from "../FollowBtn";
import UserBox from "./UserBox";
import { useSelector } from "react-redux";

const UserFollowBox = ({ user, inFollowBox = false }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const bgColor = useColorModeValue("cbg.light", "cbg.dark");
  const textColor = useColorModeValue("ccl.light", "ccl.dark");

  return (
    <>
      <Flex
        width={"100%"}
        height={"80px"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={bgColor}
        padding={"0 12px"}
        borderRadius={inFollowBox ? "" : "10px"}
        mb={inFollowBox ? "" : "10px"}
        borderBottom={inFollowBox ? "1px solid gray" : ""}
      >
        <UserBox user={user} inFollowBox={inFollowBox} />
        {userInfo?._id !== user?._id && <FollowBtn user={user} />}
      </Flex>
    </>
  );
};

export default UserFollowBox;

import { Avatar, Button, Card, Flex, Input, useColorMode } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { updatePostAction } from "../store/PostSlice";
import PostConstants from "../util/PostConstants";

const CreatePostBar = () => {
  const { colorMode } = useColorMode();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);

  const handleOpenPostPopup = () => {
    dispatch(updatePostAction(PostConstants.ACTIONS.CREATE));
  };

  return (
    <Card padding={"16px 20px"} borderRadius={"12px"} mb={"12px"} bg={colorMode === "dark" ? "#181818" : "#ffffff"}>
      <Flex gap={"12px"} alignItems={"center"}>
        <a href={`/users/${userInfo._id}`}>
          <Avatar src={userInfo?.avatar} alt="user-avatar" />
        </a>
        <Input
          placeholder="What's new"
          padding={"6px"}
          border={"none"}
          onClick={() => handleOpenPostPopup()}
        />
        <Button onClick={() => handleOpenPostPopup()}>Post</Button>
      </Flex>
    </Card>
  );
};

export default CreatePostBar;

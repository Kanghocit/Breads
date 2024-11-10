import { Avatar, Flex, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  MESSAGE_PATH,
  Route,
} from "../../../../../../../Breads-Shared/APIConfig";
import Socket from "../../../../../../../socket";
import { updateMsg } from "../../../../../../../store/MessageSlice";
import { emojiMap } from "../../../../../../../util";

const UserReactItem = ({ userId, react, msgId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);
  const participant = useSelector(
    (state) => state.message.selectedConversation?.participant
  );
  const isOwnReact = userInfo?._id === userId;
  const userDisplay = isOwnReact ? userInfo : participant;

  const handleSeeProfile = () => {
    navigate(`/users/${participant?._id}`);
  };

  const handleRemoveReact = async () => {
    try {
      const socket = Socket.getInstant();
      socket.emit(
        Route.MESSAGE + MESSAGE_PATH.REACT,
        {
          participantId: participant?._id,
          userId: userInfo?._id,
          msgId: msgId,
          react: react,
        },
        ({ data }) => {
          if (data?._id) {
            dispatch(updateMsg(data));
          }
        }
      );
    } catch (err) {
      console.error("handleRemoveReact: ", err);
    }
  };

  return (
    <Flex
      width={"100%"}
      height={"52px"}
      alignItems={"center"}
      justifyContent={"space-between"}
      p={2}
      cursor={"pointer"}
    >
      <Flex gap={2} alignItems={"center"}>
        <Avatar src={userDisplay?.avatar} width={"40px"} height={"40px"} />
        <Flex
          flexDir={"column"}
          ml={2}
          onClick={() => {
            if (isOwnReact) {
              handleRemoveReact();
            } else {
              handleSeeProfile();
            }
          }}
        >
          <Text fontWeight={600}>{userDisplay?.username}</Text>
          <Text fontSize={"12px"} color={"gray"}>
            {isOwnReact ? "Remove react" : "See detail profile"}
          </Text>
        </Flex>
      </Flex>
      <Text>{emojiMap[react]?.icon}</Text>
    </Flex>
  );
};

export default UserReactItem;

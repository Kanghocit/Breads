import { Container, Flex, Image } from "@chakra-ui/react";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MESSAGE_PATH, Route } from "../../../../../../Breads-Shared/APIConfig";
import {
  Constants,
  gif,
} from "../../../../../../Breads-Shared/Constants/index";
import Socket from "../../../../../../socket";
import {
  addNewMsg,
  defaulMessageInfo,
} from "../../../../../../store/MessageSlice";

const GifMsgBox = ({ onClose }) => {
  const dispatch = useDispatch();
  const participant = useSelector(
    (state) => state.message.selectedConversation?.participant
  );
  const userInfo = useSelector((state) => state.user.userInfo);

  const handleSendMsg = async (gifUrl) => {
    const socket = Socket.getInstant();
    const msgPayload = {
      recipientId: participant?._id,
      senderId: userInfo._id,
      message: {
        ...defaulMessageInfo,
        media: [
          {
            url: gifUrl,
            type: Constants.MEDIA_TYPE.GIF,
          },
        ],
      },
    };
    socket.emit(Route.MESSAGE + MESSAGE_PATH.CREATE, msgPayload, (newMsg) => {
      dispatch(addNewMsg(newMsg));
    });
    onClose();
  };

  return (
    <Container
      p={0}
      overflowY={"auto"}
      maxHeight={"400px"}
      sx={{
        "&::-webkit-scrollbar": {
          width: "12px",
        },
        "&::-webkit-scrollbar-track": {
          background: "white",
          borderRadius: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "gray",
          borderRadius: "8px",
          border: "3px solid white",
        },
      }}
    >
      <Flex wrap="wrap">
        {gif.map((link, index) => (
          <Image
            loading="lazy"
            key={link}
            src={link}
            alt={`GIF ${index + 1}`}
            width="45%"
            height="auto"
            borderRadius={"8px"}
            objectFit={"cover"}
            m={1}
            onClick={() => {
              console.log("here");
              handleSendMsg(link);
            }}
          />
        ))}
      </Flex>
    </Container>
  );
};

export default memo(GifMsgBox);

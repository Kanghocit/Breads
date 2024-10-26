import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { MdThumbUp } from "react-icons/md";
import { TbLibraryPhoto } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { MESSAGE_PATH, Route } from "../../../../../Breads-Shared/APIConfig";
import useDebounce from "../../../../../hooks/useDebounce";
import Socket from "../../../../../socket";
import {
  addNewMsg,
  defaulMessageInfo,
  updateLoadingUpload,
  updateMsgInfo,
} from "../../../../../store/MessageSlice";
import { handleUploadFiles, replaceEmojis } from "../../../../../util";
import EmojiMsgBtn from "./Emoji";
import FileUpload from "./File";
import GifMsgBtn from "./Gif";
import IconWrapper from "./IconWrapper";
import UploadDisplay from "./UploadDisplay";

export const ACTIONS = {
  FILES: "Files",
  MEDIA: "Media",
  GIF: "Gif",
  AUDIO: "Audio",
  EMOJI: "Emoji",
  SEND: "Send",
};

export const iconStyle = {
  width: "100%",
  height: "100%",
  maxWidth: "100%",
  maxHeight: "100%",
};

const MessageInput = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const { msgInfo, loadingUploadMsg } = useSelector((state) => state.message);
  const participant = useSelector(
    (state) => state.message.selectedConversation?.participant
  );
  const files = msgInfo.files;
  const [popup, setPopup] = useState("");
  const [closeTooltip, setCloseTooltip] = useState(false);
  const [filesData, setFilesData] = useState([]);
  const [content, setContent] = useState("");
  const debouceContent = useDebounce(content);
  const mediaRef = useRef();
  const ableToSend =
    !!content.trim() ||
    msgInfo.files?.length !== 0 ||
    msgInfo.media?.length !== 0 ||
    msgInfo.icon;

  useEffect(() => {
    dispatch(
      updateMsgInfo({
        ...msgInfo,
        content: debouceContent,
      })
    );
  }, [debouceContent]);

  useEffect(() => {
    if (loadingUploadMsg) {
      handleSendMsg(false);
      dispatch(updateLoadingUpload(false));
    }
  }, [loadingUploadMsg]);

  const onClose = () => {
    setPopup("");
    setCloseTooltip(false);
  };

  const onOpen = (popupName) => {
    setPopup(popupName);
    setCloseTooltip(true);
  };

  const icons = [
    {
      action: ACTIONS.FILES,
      icon: (
        <>
          <FileUpload setFilesData={setFilesData} />
        </>
      ),
    },
    {
      action: ACTIONS.MEDIA,
      icon: (
        <>
          <Input
            type="file"
            accept="image/*"
            style={iconStyle}
            hidden
            ref={mediaRef}
          />
          <TbLibraryPhoto
            style={iconStyle}
            onClick={() => mediaRef.current.click()}
          />
        </>
      ),
    },
    {
      action: ACTIONS.GIF,
      icon: <GifMsgBtn popup={popup} onClose={onClose} onOpen={onOpen} />,
    },
    // {
    //   action: ACTIONS.AUDIO,
    //   icon: <AiFillAudio style={iconStyle} />,
    // },
  ];

  const handleSendMsg = async (clickUpload) => {
    let payload = JSON.parse(JSON.stringify(msgInfo));
    if (payload.files?.length) {
      if (clickUpload) {
        dispatch(updateLoadingUpload(true));
        return;
      }
      const filesId = await handleUploadFiles({
        files: filesData,
        userId: userInfo._id,
      });
      payload.files = filesId;
    }
    const socket = Socket.getInstant();
    const msgPayload = {
      recipientId: participant?._id,
      senderId: userInfo._id,
      message: payload,
    };
    socket.emit(Route.MESSAGE + MESSAGE_PATH.CREATE, msgPayload, (newMsg) => {
      dispatch(addNewMsg(newMsg));
    });
    dispatch(updateMsgInfo(defaulMessageInfo));
    setContent("");
  };

  return (
    <form
      style={{
        position: "relative",
      }}
    >
      {!!files && files?.length !== 0 && <UploadDisplay />}
      <InputGroup alignItems={"center"} p={2} width={"100%"}>
        {icons.map(({ action, icon }) => (
          <IconWrapper label={closeTooltip ? "" : action} icon={icon} />
        ))}
        <Input
          flex={1}
          placeholder="Type a message"
          margin={"0 8px"}
          value={content}
          onChange={(e) => {
            if (!loadingUploadMsg) {
              setContent(replaceEmojis(e.target.value));
            }
          }}
          opacity={loadingUploadMsg ? 0.4 : 1}
          bg={loadingUploadMsg ? "gray" : ""}
        />
        <InputRightElement cursor={"pointer"} mr={"38px"} mt={"8px"}>
          <EmojiMsgBtn
            popup={popup}
            closeTooltip={closeTooltip}
            onClose={onClose}
            onOpen={onOpen}
          />
        </InputRightElement>
        <IconWrapper
          label={ACTIONS.SEND}
          icon={
            ableToSend ? (
              <IoSendSharp
                style={iconStyle}
                onClick={() => {
                  if (!loadingUploadMsg) {
                    handleSendMsg(true);
                  }
                }}
              />
            ) : (
              <MdThumbUp style={iconStyle} />
            )
          }
        />
      </InputGroup>
    </form>
  );
};

export default MessageInput;

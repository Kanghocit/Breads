import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { MdThumbUp } from "react-icons/md";
import { TbLibraryPhoto } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import {
  MESSAGE_PATH,
  Route,
  UTIL_PATH,
} from "../../../../../Breads-Shared/APIConfig";
import useDebounce from "../../../../../hooks/useDebounce";
import Socket from "../../../../../socket";
import {
  defaulMessageInfo,
  updateMsgInfo,
} from "../../../../../store/MessageSlice";
import { replaceEmojis } from "../../../../../util";
import EmojiMsgBtn from "./Emoji";
import FileUpload from "./File";
import GifMsgBtn from "./Gif";
import IconWrapper from "./IconWrapper";
import UploadDisplay from "./UploadDisplay";
import { POST } from "../../../../../config/API";

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
  const msgInfo = useSelector((state) => state.message.msgInfo);
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

  const handleSendMsg = async () => {
    let payload = JSON.parse(JSON.stringify(msgInfo));
    if (payload.files?.length) {
      const formData = new FormData();
      const filesName = [];
      for (let i = 0; i < filesData.length; i++) {
        filesName.push(filesData[i].name);
        formData.append("files", filesData[i]);
      }
      formData.append("filesName", filesName);
      const filesId = await POST({
        path: Route.UTIL + UTIL_PATH.UPLOAD + `?userId=${userInfo?._id}`,
        payload: formData,
      });
      payload.files = filesId;
    }
    const socket = Socket.getInstant();
    const msgPayload = {
      recipientId: participant?._id,
      senderId: userInfo._id,
      message: payload,
    };
    socket.emitWithAck(Route.MESSAGE + MESSAGE_PATH.CREATE, msgPayload);
    dispatch(updateMsgInfo(defaulMessageInfo));
  };

  return (
    <>
      <form
        style={{
          position: "relative",
        }}
      >
        {!!files && files?.length !== 0 && <UploadDisplay />}
        <InputGroup alignItems={"center"} p={2}>
          {icons.map(({ action, icon }) => (
            <IconWrapper label={closeTooltip ? "" : action} icon={icon} />
          ))}
          <Input
            flex={1}
            placeholder="Type a message"
            margin={"0 8px"}
            value={content}
            onChange={(e) => setContent(replaceEmojis(e.target.value))}
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
                  onClick={() => handleSendMsg()}
                />
              ) : (
                <MdThumbUp style={iconStyle} />
              )
            }
          />
        </InputGroup>
      </form>
    </>
  );
};

export default MessageInput;

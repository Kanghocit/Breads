import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { AiFillAudio } from "react-icons/ai";
import { IoSendSharp } from "react-icons/io5";
import { TbLibraryPhoto } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import EmojiMsgBtn from "./Emoji";
import FileUpload from "./File";
import GifMsgBtn from "./Gif";
import IconWrapper from "./IconWrapper";
import UploadDisplay from "./UploadDisplay";
import { MdThumbUp } from "react-icons/md";
import useDebounce from "../../../hooks/useDebounce";
import { updateMsgInfo } from "../../../store/MessageSlice";
import { replaceEmojis } from "../../../util";
import Socket from "../../../socket";
import { MESSAGE_PATH, Route } from "../../../Breads-Shared/APIConfig";

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
  const files = msgInfo.files;
  const [popup, setPopup] = useState("");
  const [closeTooltip, setCloseTooltip] = useState(false);
  const [filesData, setFilesData] = useState([]);
  const [content, setContent] = useState("");
  const debouceContent = useDebounce(content);
  const mediaRef = useRef();

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

  const handleSendMsg = () => {
    const socket = Socket.getInstant();
    const payload = {
      recipientId: "66e66070f27cd4c9a4287fa0",
      senderId: userInfo._id,
      message: msgInfo,
    };
    socket.emitWithAck(Route.MESSAGE + MESSAGE_PATH.CREATE, payload);
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
              !!content.trim() ? (
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

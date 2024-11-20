import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { MESSAGE_PATH, Route } from "../../../../../Breads-Shared/APIConfig";
import useDebounce from "../../../../../hooks/useDebounce";
import Socket from "../../../../../socket";
import {
  addNewMsg,
  defaulMessageInfo,
  selectMsg,
  updateLoadingUpload,
  updateMsgInfo,
} from "../../../../../store/MessageSlice";
import { handleUploadFiles, replaceEmojis } from "../../../../../util";
import { getCurrentTheme } from "../../../../../util/Themes";
import EmojiMsgBtn from "./Emoji";
import FileUpload from "./File";
import GifMsgBtn from "./Gif";
import IconWrapper from "./IconWrapper";
import MediaUpload from "./Media";
import MessageIconBtn from "./MessageIconBtn";
import { useTranslation } from "react-i18next";

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
  const { msgInfo, loadingUploadMsg, selectedConversation, selectedMsg } =
    useSelector((state) => state.message);
  const participant = selectedConversation?.participant;
  const files = msgInfo.files;
  const media = msgInfo.media;
  const [popup, setPopup] = useState("");
  const [closeTooltip, setCloseTooltip] = useState(false);
  const [filesData, setFilesData] = useState([]);
  const [content, setContent] = useState("");
  const inputRef = useRef(null);
  const debouceContent = useDebounce(content, 200);
  const ableToSend =
    !!content.trim() ||
    files?.length !== 0 ||
    media?.length !== 0 ||
    msgInfo.icon;
  const { conversationBackground, user1Message } = getCurrentTheme(
    selectedConversation?.theme
  );
  const bg = conversationBackground?.backgroundColor;
  const textColor = user1Message?.color;
  const borderColor = user1Message?.borderColor;
  const { t } = useTranslation();

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
      handleSendMsg({ clickUpload: false });
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
      icon: <FileUpload setFilesData={setFilesData} />,
    },
    {
      action: ACTIONS.MEDIA,
      icon: <MediaUpload />,
    },
    {
      action: ACTIONS.GIF,
      icon: (
        <GifMsgBtn
          popup={popup}
          onClose={onClose}
          onOpen={onOpen}
          color={borderColor}
        />
      ),
    },
    // {
    //   action: ACTIONS.AUDIO,
    //   icon: <AiFillAudio style={iconStyle} />,
    // },
  ];

  const handleSendMsg = async ({ clickUpload = true, sendIcon = false }) => {
    let payload = JSON.parse(JSON.stringify(msgInfo));
    if (clickUpload) {
      dispatch(updateLoadingUpload(true));
      return;
    }
    if (payload.files?.length) {
      const filesId = await handleUploadFiles({
        files: filesData,
        userId: userInfo._id,
      });
      payload.files = filesId;
    }
    if (sendIcon) {
      payload.content = sendIcon;
    }
    if (selectedMsg?._id) {
      payload.respondTo = selectedMsg?._id;
    }
    const socket = Socket.getInstant();
    const msgPayload = {
      recipientId: participant?._id,
      senderId: userInfo._id,
      message: payload,
    };
    socket.emit(Route.MESSAGE + MESSAGE_PATH.CREATE, msgPayload, ({ data }) => {
      dispatch(addNewMsg(data));
      dispatch(updateLoadingUpload(false));
      dispatch(updateMsgInfo(defaulMessageInfo));
      dispatch(selectMsg(null));
      setContent("");
    });
  };

  return (
    <form
      style={{
        position: "relative",
        backgroundColor: conversationBackground?.backgroundColor,
        backgroundBlendMode: conversationBackground?.backgroundBlendMode,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <InputGroup
        alignItems={"center"}
        p={2}
        width={"100%"}
        color={borderColor}
      >
        {icons.map(({ action, icon }) => (
          <Fragment key={action}>
            <IconWrapper label={closeTooltip ? "" : action} icon={icon} />
          </Fragment>
        ))}
        <Input
          ref={inputRef}
          flex={1}
          placeholder={t('Typeamessage')}
          margin={"0 8px"}
          value={content}
          bg={loadingUploadMsg ? "gray" : bg ? bg : ""}
          color={textColor ? textColor : ""}
          border={borderColor ? `1px solid ${borderColor}` : ""}
          onChange={(e) => {
            if (!loadingUploadMsg) {
              setContent(replaceEmojis(e.target.value));
            }
          }}
          onKeyDown={(e) => {
            if (e.keyCode === 13 && ableToSend && !loadingUploadMsg) {
              handleSendMsg({
                clickUpload: files?.length > 0 || media?.length > 0,
              });
            }
          }}
          opacity={loadingUploadMsg ? 0.4 : 1}
        />
        <InputRightElement cursor={"pointer"} mr={"38px"} mt={"8px"}>
          <EmojiMsgBtn
            popup={popup}
            closeTooltip={closeTooltip}
            onClose={onClose}
            onOpen={onOpen}
            inputRef={inputRef}
            setContent={setContent}
            color={borderColor}
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
                    handleSendMsg({
                      clickUpload: files?.length > 0 || media?.length > 0,
                    });
                  }
                }}
              />
            ) : (
              <MessageIconBtn handleSendMsg={handleSendMsg} />
            )
          }
        />
      </InputGroup>
    </form>
  );
};

export default MessageInput;

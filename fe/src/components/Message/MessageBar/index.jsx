import { SmallAddIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { AiFillAudio } from "react-icons/ai";
import { IoSendSharp } from "react-icons/io5";
import { TbLibraryPhoto } from "react-icons/tb";
import EmojiMsgBtn from "./Emoji";
import GifMsgBtn from "./Gif";
import IconWrapper from "./IconWrapper";

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
  const [popup, setPopup] = useState("");
  const mediaRef = useRef();
  const fileRef = useRef();
  const [closeTooltip, setCloseTooltip] = useState(false);

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
          <Input type="file" style={iconStyle} hidden ref={fileRef} />
          <SmallAddIcon
            style={iconStyle}
            onClick={() => fileRef.current.click()}
          />
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
    {
      action: ACTIONS.AUDIO,
      icon: <AiFillAudio style={iconStyle} />,
    },
  ];

  return (
    <form>
      <InputGroup alignItems={"center"}>
        {icons.map(({ action, icon }) => (
          <IconWrapper label={closeTooltip ? "" : action} icon={icon} />
        ))}
        <Input flex={1} placeholder="Type a message" margin={"0 8px"} />
        <InputRightElement cursor={"pointer"} mr={"32px"}>
          <EmojiMsgBtn
            popup={popup}
            closeTooltip={closeTooltip}
            onClose={onClose}
            onOpen={onOpen}
          />
        </InputRightElement>
        <IconWrapper
          label={ACTIONS.SEND}
          icon={<IoSendSharp style={iconStyle} />}
        />
      </InputGroup>
    </form>
  );
};

export default MessageInput;

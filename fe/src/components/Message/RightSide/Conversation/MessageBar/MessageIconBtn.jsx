import { useSelector } from "react-redux";
import { iconStyle } from ".";
import { getEmojiIcon } from "../../../../../util";

const MessageIconBtn = ({ handleSendMsg }) => {
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const emoji = selectedConversation?.emoji;
  const iconStr = getEmojiIcon(emoji);

  return (
    <div
      style={{
        ...iconStyle,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => {
        handleSendMsg({ sendIcon: iconStr });
      }}
    >
      {iconStr}
    </div>
  );
};

export default MessageIconBtn;

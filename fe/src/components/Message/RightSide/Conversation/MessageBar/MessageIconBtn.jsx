import { useSelector } from "react-redux";
import { iconStyle } from ".";
import { emojiMap } from "../../../../../util";

const MessageIconBtn = ({ handleSendMsg }) => {
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const emoji = selectedConversation?.emoji;
  const iconStr = emojiMap[emoji]?.icon;

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

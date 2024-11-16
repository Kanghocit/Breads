import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdOutlineAttachFile, MdOutlineReply } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  MESSAGE_PATH,
  Route,
} from "../../../../../../../Breads-Shared/APIConfig";
import Socket from "../../../../../../../socket";
import { updateCurrentPageMsg } from "../../../../../../../store/MessageSlice";
import { getMsgs } from "../../../../../../../store/MessageSlice/asyncThunk";
import { getCurrentTheme } from "../../../../../../../util/Themes";

const RepliedMsg = ({ msg, repliedMsgs }) => {
  const dispatch = useDispatch();
  const { selectedConversation, loadingMsgs, currentPageMsg } = useSelector(
    (state) => state.message
  );
  const msgEle = document.getElementById(`msg_${msg?._id}`);
  const participant = selectedConversation?.participant;
  const userInfo = useSelector((state) => state.user.userInfo);
  const { sender, content, media, file } = repliedMsgs;
  const { user1Message, user2Message } = getCurrentTheme(
    selectedConversation?.theme
  );
  const ownRepliedMessage = userInfo?._id === sender;
  const ownMessage = msg?.sender === userInfo?._id;
  const {
    backgroundColor: msgBg,
    color: msgColor,
    borderColor,
  } = ownMessage ? user1Message : user2Message;
  const cssProp = {
    float: ownMessage ? "right" : "left",
    width: "fit-content",
    pos: "relative",
    top: "12px",
    bg: "#d3d3d37a",
    py: 1,
    pb: 3,
    px: 3,
    borderRadius: ownMessage ? "16px 16px 0 16px" : "16px 16px 16px 0",
    color: msgColor,
    border: borderColor ? `1px solid ${borderColor}` : "",
  };
  const [startScroll, setStartScroll] = useState(false);

  useEffect(() => {
    if (startScroll && msgEle && !loadingMsgs) {
      msgEle.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    setStartScroll(false);
  }, [loadingMsgs, startScroll]);

  const clickSeeDetailMsg = () => {
    if (!msgEle) {
      const socket = Socket.getInstant();
      socket.emit(
        Route.MESSAGE + MESSAGE_PATH.GET_MSGS_BY_SEARCH,
        {
          userId: userInfo._id,
          conversationId: selectedConversation?._id,
          limit: 30,
          searchMsgId: msg._id,
          currentPage: currentPageMsg,
        },
        ({ data, page }) => {
          if (data?.length) {
            dispatch(
              getMsgs({
                msgs: data,
                isNew: false,
              })
            );
            dispatch(updateCurrentPageMsg(page));
          }
        }
      );
      setTimeout(() => {
        setStartScroll(true);
      }, 1500);
    } else {
      setStartScroll(true);
    }
  };

  return (
    <div
      style={{
        cursor: "pointer",
      }}
      onClick={() => {
        clickSeeDetailMsg();
      }}
    >
      <Flex
        alignItems={"center"}
        gap={2}
        pos={"relative"}
        height={"16px"}
        justifyContent={ownMessage ? "end" : "start"}
        color={msgColor}
      >
        <MdOutlineReply />{" "}
        <span
          style={{
            fontSize: "12px",
          }}
        >
          Reply to {ownRepliedMessage ? "yourself" : participant?.username}
        </span>
      </Flex>
      {content?.trim() ? (
        <Text
          {...cssProp}
          maxW={"30vw"}
          textOverflow={"ellipsis"}
          overflow={"hidden"}
          whiteSpace={"nowrap"}
        >
          {content}
        </Text>
      ) : (
        <>
          {(media?.length || file?._id) && (
            <Flex alignItems={"center"} {...cssProp}>
              <MdOutlineAttachFile />
              <Text ml={1}>
                Attached {media?.length ? media[0].type : "file"}
              </Text>
            </Flex>
          )}
        </>
      )}
    </div>
  );
};

export default RepliedMsg;

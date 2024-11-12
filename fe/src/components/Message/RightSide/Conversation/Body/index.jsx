import { Button, Flex, Text } from "@chakra-ui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { MESSAGE_PATH, Route } from "../../../../../Breads-Shared/APIConfig";
import useSocket from "../../../../../hooks/useSocket";
import Socket from "../../../../../socket";
import {
  addNewMsg,
  updateCurrentPageMsg,
  updateMsg,
} from "../../../../../store/MessageSlice";
import { getMsgs } from "../../../../../store/MessageSlice/asyncThunk";
import { formatDateToDDMMYYYY } from "../../../../../util";
import InfiniteScroll from "../../../../InfiniteScroll";
import Message from "./Message";
import { getCurrentTheme } from "../../../../../util/Themes";

const ConversationBody = ({ openDetailTab }) => {
  const currentDateFormat = formatDateToDDMMYYYY(new Date());
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const { selectedConversation, messages, currentPageMsg } = useSelector(
    (state) => state.message
  );
  const lastMsg = selectedConversation?.lastMsg;
  const [scrollText, setScrollText] = useState("Move to current");
  const [noticeNewMsgBox, setNoticeNewMsgBox] = useState(false);
  const conversationScreenRef = useRef(null);
  const layerRef = useRef(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const { conversationBackground, user1Message } = getCurrentTheme(
    selectedConversation?.theme
  );

  useEffect(() => {
    if (selectedConversation?._id && userInfo?._id) {
      handleGetMsgs({ page: 1 });
      if (layerRef?.current && conversationScreenRef?.current) {
        layerRef.current.style.width =
          conversationScreenRef.current.clientWidth - 4 + "px";
        layerRef.current.style.height =
          conversationScreenRef.current.clientHeight + "px";
      }
    }
  }, [selectedConversation?._id, userInfo]);

  useSocket((socket) => {
    socket.on(Route.MESSAGE + MESSAGE_PATH.GET_MESSAGE, (data) => {
      if (data) {
        dispatch(addNewMsg(data));
        setScrollText("New message");
      }
    });
    socket.on(Route.MESSAGE + MESSAGE_PATH.UPDATE_MSG, (data) => {
      if (data) {
        console.log("data: ", data);
        dispatch(updateMsg(data));
      }
    });
  }, []);

  useEffect(() => {
    const conversationTag = document.getElementById("conversation-body");
    if (conversationTag) {
      const listener = () => {
        const { scrollTop, clientHeight, scrollHeight } = conversationTag;
        if (scrollTop + clientHeight < scrollHeight) {
          setNoticeNewMsgBox(true);
        } else {
          setNoticeNewMsgBox(false);
        }
      };
      conversationTag.addEventListener("scroll", listener);
      return () => {
        conversationTag.removeEventListener("scroll", listener);
      };
    }
  }, []);

  useEffect(() => {
    if ((firstLoad && Object.keys(messages)?.length > 0) || !!lastMsg) {
      scrollToBottom();
    }
  }, [lastMsg?._id, firstLoad]);

  const scrollToBottom = () => {
    if (conversationScreenRef?.current) {
      const listMsgEle = document.getElementById("list-msg");
      conversationScreenRef.current.scrollTo({
        top: listMsgEle.scrollHeight,
        behavior: "smooth",
      });
      setTimeout(() => {
        layerRef.current.style.opacity = 0;
        layerRef.current.style.visibility = "hidden";
        layerRef.current.style.transition =
          "opacity 0.3s ease-out, visibility 0.2s linear";
      }, 1500);
    }
  };

  const handleGetMsgs = async ({ page }) => {
    const socket = Socket.getInstant();
    socket.emit(
      Route.MESSAGE + MESSAGE_PATH.GET_MESSAGES,
      {
        userId: userInfo._id,
        conversationId: selectedConversation?._id,
        page: page,
        limit: 30,
      },
      (res) => {
        const isNew = page === 1;
        const { data } = res;
        if (data.length) {
          dispatch(
            getMsgs({
              isNew: isNew ? true : false,
              msgs: data,
            })
          );
          setTimeout(() => {
            setFirstLoad(false);
            dispatch(updateCurrentPageMsg(page));
          }, 500);
        }
      }
    );
  };

  return (
    <>
      <div
        id="conversation-body"
        ref={conversationScreenRef}
        style={{
          overflowY: "auto",
          flex: 1,
          maxHeight: "calc(100% - 112px)",
          position: "relative",
          backgroundBlendMode: conversationBackground?.backgroundBlendMode,
          backgroundImage: `url(${conversationBackground?.backgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div
          ref={layerRef}
          style={{
            position: "fixed",
            backgroundColor: conversationBackground?.backgroundColor,
            zIndex: 5000,
          }}
        ></div>
        <Flex
          flexDir={"column"}
          gap={"12px"}
          my={2}
          height={"fit-content"}
          py={2}
          px={3}
          id="list-msg"
        >
          <InfiniteScroll
            queryFc={(page) => {
              handleGetMsgs({ page: page });
            }}
            data={Object.keys(messages)}
            cpnFc={(date) => {
              const msgs = messages[date];
              const brStyle = {
                height: "2px",
                backgroundColor: user1Message?.backgroundColor,
                flex: 1,
              };
              return (
                <Fragment key={date}>
                  <Flex alignItems={"center"} justifyContent={"center"}>
                    <div style={brStyle} />
                    <Text px={2} color={user1Message?.backgroundColor}>
                      {date === currentDateFormat ? "Today" : date}
                    </Text>
                    <div style={brStyle} />
                  </Flex>
                  {msgs.map((msg) => (
                    <Message msg={msg} />
                  ))}
                </Fragment>
              );
            }}
            condition={!!userInfo?._id && selectedConversation?._id}
            reverseScroll={true}
            elementId={"conversation-body"}
            prefixId="msg"
            updatePageValue={currentPageMsg}
          />
        </Flex>
      </div>
      {noticeNewMsgBox && (
        <Button
          position={"fixed"}
          right={openDetailTab ? "22vw" : "30px"}
          bottom={"72px"}
          onClick={() => {
            scrollToBottom();
            setNoticeNewMsgBox(false);
            setScrollText("Move to current");
          }}
          zIndex={3000}
        >
          <Flex alignItems={"center"} gap={2}>
            {scrollText}
            <FaAngleDown />
          </Flex>
        </Button>
      )}
    </>
  );
};

export default ConversationBody;

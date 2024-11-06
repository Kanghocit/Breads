import { Button, Flex, Text } from "@chakra-ui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { MESSAGE_PATH, Route } from "../../../../../Breads-Shared/APIConfig";
import useSocket from "../../../../../hooks/useSocket";
import Socket from "../../../../../socket";
import { addNewMsg } from "../../../../../store/MessageSlice";
import { getMsgs } from "../../../../../store/MessageSlice/asyncThunk";
import { formatDateToDDMMYYYY } from "../../../../../util";
import Message from "./Message";
import MessagesSkeleton from "./Message/skeleton";
import InfiniteScroll from "../../../../InfiniteScroll";

const ConversationBody = ({ openDetailTab }) => {
  const currentDateFormat = formatDateToDDMMYYYY(new Date());
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const { selectedConversation, messages } = useSelector(
    (state) => state.message
  );
  const lastMsg = selectedConversation?.lastMsg;
  const [scrollText, setScrollText] = useState("Move to current");
  const [noticeNewMsgBox, setNoticeNewMsgBox] = useState(false);
  const conversationScreenRef = useRef(null);
  const init = useRef(true);
  const [firstLoad, setFirstLoad] = useState(false);

  useEffect(() => {
    if (selectedConversation?._id && userInfo?._id) {
      handleGetMsgs({ page: 1 });
    }
  }, [selectedConversation?._id, userInfo]);

  useSocket((socket) => {
    socket.on(Route.MESSAGE + MESSAGE_PATH.GET_MESSAGE, (payload) => {
      if (payload) {
        dispatch(addNewMsg(payload));
        setScrollText("New message");
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
      conversationScreenRef.current.scrollTo({
        top: conversationScreenRef?.current?.scrollHeight,
        behavior: "smooth",
      });
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
        dispatch(
          getMsgs({
            isNew: isNew ? true : false,
            msgs: data,
          })
        );
        if (isNew) {
          setTimeout(() => {
            setFirstLoad(true);
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
        }}
      >
        <Flex
          flexDir={"column"}
          gap={4}
          my={2}
          height={"fit-content"}
          py={2}
          px={3}
        >
          <InfiniteScroll
            queryFc={(page) => {
              handleGetMsgs({ page });
            }}
            data={Object.keys(messages)}
            cpnFc={(date) => {
              const msgs = messages[date];
              const brStyle = {
                height: "2px",
                backgroundColor: "gray",
                flex: 1,
              };
              return (
                <Fragment key={date}>
                  <Flex alignItems={"center"} justifyContent={"center"}>
                    <div style={brStyle} />
                    <Text px={2}>
                      {date === currentDateFormat ? "Today" : date}
                    </Text>
                    <div style={brStyle} />
                  </Flex>
                  {msgs.map((msg) => (
                    <Message key={msg?._id} msg={msg} />
                  ))}
                </Fragment>
              );
            }}
            condition={!!userInfo?._id && selectedConversation?._id}
            reverseScroll={true}
            elementId={"conversation-body"}
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

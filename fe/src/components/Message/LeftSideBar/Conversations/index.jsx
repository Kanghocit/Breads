import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EmptyContentSvg } from "../../../../assests/icons";
import { MESSAGE_PATH, Route } from "../../../../Breads-Shared/APIConfig";
import Socket from "../../../../socket";
import { selectConversation } from "../../../../store/MessageSlice";
import { getConversations } from "../../../../store/MessageSlice/asyncThunk";
import InfiniteScroll from "../../../InfiniteScroll";
import ConversationBar from "./ConversationBar";
import ConversationSkeleton from "./ConversationBar/skeleton";
import { useParams } from "react-router-dom";

const Conversations = ({ searchValue }) => {
  const { conversationId } = useParams();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const currentPage = useSelector((state) => state.util.currentPage);
  const { conversations, selectedConversation, loadingConversations } =
    useSelector((state) => state.message);
  const [init, setInit] = useState(true);

  useEffect(() => {
    if (userInfo._id) {
      setInit(false);
    }
    if (selectedConversation?._id) {
      const timeout = setTimeout(() => {
        const conversationHtml = document.getElementById(
          `conversation_${selectedConversation?._id}`
        );
        conversationHtml?.scrollIntoView();
      }, 500);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [userInfo._id, selectedConversation?._id]);

  useEffect(() => {
    if (!init) {
      handleGetConversations({ page: 1 });
    }
  }, [searchValue]);

  const handleGetConversations = async ({ page }) => {
    const socket = Socket.getInstant();
    socket.emit(
      Route.MESSAGE + MESSAGE_PATH.GET_CONVERSATIONS,
      { userId: userInfo._id, page: page, limit: 15, searchValue },
      (res) => {
        const { data } = res;
        if (data) {
          dispatch(
            getConversations({
              data: data,
              isLoadNew: page === 1 ? true : false,
            })
          );
          if (!selectedConversation && !conversationId) {
            dispatch(selectConversation(data[0]));
          }
        }
      }
    );
  };

  return (
    <>
      {conversations?.length !== 0 || !init ? (
        <>
          <InfiniteScroll
            queryFc={(page) => {
              handleGetConversations({
                page,
              });
            }}
            data={conversations}
            cpnFc={(conversation) => (
              <ConversationBar
                key={conversation?._id}
                conversation={conversation}
              />
            )}
            condition={!init}
            deps={[userInfo._id, currentPage]}
            skeletonCpn={<ConversationSkeleton />}
            preloadIndex={1}
          />
        </>
      ) : (
        <>
          {loadingConversations ? (
            <Flex
              gap={"12px"}
              flexDirection={"column"}
              justifyContent={"center"}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <ConversationSkeleton key={`skeleton-conversation-${num}`} />
              ))}
            </Flex>
          ) : (
            <Flex justifyContent={"center"} alignItems={"center"}>
              <EmptyContentSvg />
            </Flex>
          )}
        </>
      )}
    </>
  );
};

export default Conversations;

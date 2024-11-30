import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MESSAGE_PATH, Route } from "../../../../../../Breads-Shared/APIConfig";
import Socket from "../../../../../../socket";
import InfiniteScroll from "../../../../../InfiniteScroll";
import SendNextItem from "./SendNextItem/item";
import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Input,
  useColorModeValue,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import IconWrapper from "../../MessageBar/IconWrapper";
import { CloseIcon } from "@chakra-ui/icons";
import { EmptyContentSvg } from "../../../../../../assests/icons";
import {
  updateConversations,
  updateSendNextBox,
} from "../../../../../../store/MessageSlice";
import { useTranslation } from "react-i18next";

const SendNextBox = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const { selectedConversation, sendNextBox, selectedMsg } = useSelector(
    (state) => state.message
  );
  const [searchValue, setSearchValue] = useState("");
  const [selectedConversations, setSelectedConversations] = useState([]);
  const init = useRef(true);

  useEffect(() => {
    if (selectedConversation?._id) {
      handleGetConversations({ page: 1 });
    }
  }, [searchValue, selectedConversation?._id]);

  const handleGetConversations = async ({ page }) => {
    try {
      init.current = false;
      const socket = Socket.getInstant();
      socket.emit(
        Route.MESSAGE + MESSAGE_PATH.GET_CONVERSATIONS,
        {
          userId: userInfo?._id,
          page: page,
          limit: 15,
          searchValue,
        },
        ({ data }) => {
          if (!!data && data?.length) {
            const listSendNext = data?.filter(
              (conversation) => conversation?._id !== selectedConversation?._id
            );
            dispatch(
              updateSendNextBox({
                key: "conversations",
                value:
                  page === 1
                    ? listSendNext
                    : [...sendNextBox.conversations, ...listSendNext],
              })
            );
          }
        }
      );
    } catch (err) {
      console.error("handleGetConversations: ", err);
    }
  };

  const handleCloseBox = () => {
    dispatch(
      updateSendNextBox({
        key: "open",
        value: false,
      })
    );
    setSelectedConversations([]);
  };

  const handleSendNext = async () => {
    try {
      const socket = Socket.getInstant();
      socket.emit(
        Route.MESSAGE + MESSAGE_PATH.SEND_NEXT,
        {
          conversationsInfo: selectedConversations,
          msgInfo: selectedMsg,
          userId: userInfo._id,
        },
        ({ data }) => {
          const msgs = data?.msgs;
          const listConversationInfo = data?.listConversationInfo;
          if (msgs) {
            dispatch(updateConversations(listConversationInfo));
          }
        }
      );
      dispatch(
        updateSendNextBox({
          key: "open",
          value: false,
        })
      );
      setSelectedConversations([]);
    } catch (err) {
      console.error("handleSendNext: ", err);
    }
  };

  return (
    <div className="send-next-box">
      <Modal isOpen={sendNextBox.open} onClose={() => handleCloseBox()}>
        <ModalOverlay />
        <ModalContent bg={useColorModeValue("gray.200", "#181818")}>
          <ModalHeader borderBottom={"1px solid gray"} pos={"relative"}>
            <Flex alignItems={"center"} justifyContent={"center"}>
              <Text>Send message to</Text>
              <div
                style={{
                  position: "absolute",
                  right: "20px",
                }}
              >
                <IconWrapper
                  icon={
                    <CloseIcon
                      width={"20px"}
                      height={"20px"}
                      p={1}
                      onClick={() => handleCloseBox()}
                    />
                  }
                />
              </div>
            </Flex>
          </ModalHeader>
          <ModalBody maxHeight={"440px"} overflowY={"auto"} px={4} my={2}>
            <Input
              fontSize={{
                base: "lg",
                md: "md",
              }}
              mb={3}
              placeholder={t("Searchforuser")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {sendNextBox.conversations?.length !== 0 || !init.current ? (
              <InfiniteScroll
                queryFc={(page) => {
                  handleGetConversations({ page });
                }}
                data={sendNextBox.conversations}
                cpnFc={(conversation) => (
                  <SendNextItem
                    conversation={conversation}
                    selectedConversations={selectedConversations}
                    setSelectedConversations={setSelectedConversations}
                  />
                )}
                deps={[userInfo._id]}
                preloadIndex={5}
              />
            ) : (
              <Flex justifyContent={"center"} alignItems={"center"}>
                <EmptyContentSvg />
              </Flex>
            )}
          </ModalBody>
          {selectedConversations?.length !== 0 && (
            <ModalFooter borderTop={"1px solid gray"}>
              <Button onClick={() => handleSendNext()}>Send</Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SendNextBox;

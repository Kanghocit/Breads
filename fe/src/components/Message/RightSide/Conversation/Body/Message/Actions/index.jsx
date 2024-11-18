import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaDeleteLeft } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { MdEmojiEmotions, MdOutlineReply } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  MESSAGE_PATH,
  Route,
} from "../../../../../../../Breads-Shared/APIConfig";
import { Constants } from "../../../../../../../Breads-Shared/Constants";
import Socket from "../../../../../../../socket";
import { selectMsg, updateMsg } from "../../../../../../../store/MessageSlice";
import { getEmojiIcon } from "../../../../../../../util";
import ClickOutsideComponent from "../../../../../../../util/ClickoutCPN";
import IconWrapper from "../../../MessageBar/IconWrapper";

const MessageAction = ({ ownMsg, msg, previousReact }) => {
  const dispatch = useDispatch();
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const userInfo = useSelector((state) => state.user.userInfo);
  const [openBox, setOpenBox] = useState(false);
  const [displayReactBox, setDisplayReactBox] = useState(false);
  const defaultEmoji = ["<3", ":D", ":O", ":(", ":slang"];
  const msgId = msg?._id;

  const boxActions = [
    {
      onClick: () => {
        dispatch(selectMsg(msg));
      },
      icon: <MdOutlineReply />,
      name: Constants.MSG_ACTION.REPLY,
    },
    {
      icon: <IoMdSend />,
      name: Constants.MSG_ACTION.SEND_NEXT,
    },
  ];
  if (ownMsg) {
    boxActions.push({
      onClick: () => {
        handleRetriveMsg();
      },
      icon: <FaDeleteLeft />,
      name: Constants.MSG_ACTION.RETRIEVE,
    });
  }

  const handleRetriveMsg = async () => {
    try {
      const socket = Socket.getInstant();
      socket.emit(
        Route.MESSAGE + MESSAGE_PATH.RETRIEVE,
        {
          msgId: msgId,
          userId: userInfo?._id,
          participantId: selectedConversation?.participant?._id,
        },
        ({ data }) => {
          dispatch(updateMsg(data));
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleReactMsg = async (react) => {
    try {
      const socket = Socket.getInstant();
      socket.emit(
        Route.MESSAGE + MESSAGE_PATH.REACT,
        {
          participantId: selectedConversation?.participant?._id,
          userId: userInfo?._id,
          msgId: msgId,
          react: react,
        },
        ({ data }) => {
          setDisplayReactBox(false);
          if (data?._id) {
            dispatch(updateMsg(data));
          }
        }
      );
    } catch (err) {
      console.error("handleReactMsg: ", err);
    }
  };

  return (
    <Flex
      pos={"relative"}
      p={0}
      m={0}
      width={"fit-content"}
      maxWidth={"fit-content"}
      mr={ownMsg ? 2 : 0}
      ml={!ownMsg ? 2 : 0}
    >
      <ClickOutsideComponent
        onClose={() => {
          setOpenBox(false);
        }}
      >
        <IconWrapper
          icon={
            <BsThreeDots
              cursor={"pointer"}
              onClick={() => {
                setOpenBox(!openBox);
              }}
            />
          }
        />
        {openBox && (
          <Flex
            position={"absolute"}
            flexDir={"column"}
            borderRadius={4}
            border={"1px solid gray"}
            p={2}
            top={"calc(100% + 4px)"}
            bg={useColorModeValue("gray.200", "#181818")}
            left={ownMsg ? "" : "0"}
            right={ownMsg ? "0" : ""}
            zIndex={1000}
            minWidth={"140px"}
          >
            {boxActions.map(({ icon, name, onClick }) => (
              <Flex
                key={name}
                alignItems={"center"}
                gap={3}
                px={2}
                py={1}
                cursor={"pointer"}
                borderRadius={4}
                _hover={{
                  bg: "gray",
                }}
                minWidth={"140px"}
                onClick={() => {
                  !!onClick && onClick();
                }}
              >
                {icon}
                <Text textTransform={"capitalize"}>{name}</Text>
              </Flex>
            ))}
          </Flex>
        )}
      </ClickOutsideComponent>
      <ClickOutsideComponent onClose={() => setDisplayReactBox(false)}>
        <IconWrapper
          icon={
            <MdEmojiEmotions
              cursor={"pointer"}
              onClick={() => setDisplayReactBox(!displayReactBox)}
            />
          }
        />
        {displayReactBox && (
          <Flex
            alignItems={"center"}
            px={2}
            py={1}
            borderRadius={6}
            pos={"absolute"}
            bottom={"calc(100%)"}
            right={"50%"}
            transform={"translateX(55%)"}
            border={"1px solid gray"}
            bg={useColorModeValue("gray.200", "#181818")}
            zIndex={1000}
          >
            {defaultEmoji.map((emjStr) => (
              <IconWrapper
                addBg={previousReact === emjStr ? true : false}
                icon={
                  <Text
                    onClick={() => {
                      handleReactMsg(emjStr);
                    }}
                  >
                    {getEmojiIcon(emjStr)}
                  </Text>
                }
              />
            ))}
          </Flex>
        )}
      </ClickOutsideComponent>
    </Flex>
  );
};

export default MessageAction;

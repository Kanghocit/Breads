import { InfoIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Flex,
  Image,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCurrentTheme } from "../../../../../util/Themes";
import { addEvent } from "../../../../../util";

const ConversationHeader = ({ openDetailTab, setOpenDetailTab, onBack }) => {
  const navigate = useNavigate();
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const participant = selectedConversation?.participant;
  const { conversationBackground, user1Message } = getCurrentTheme(
    selectedConversation?.theme
  );
  const borderColor = user1Message?.borderColor;
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      w={"full"}
      p={1}
      alignItems={"center"}
      justifyContent={"space-between"}
      height={"56px"}
      bg={conversationBackground?.backgroundColor}
      backgroundBlendMode={conversationBackground?.backgroundBlendMode}
      color={borderColor ? borderColor : ""}
    >
      <Flex
        width={"fit-content"}
        h={12}
        alignItems={"center"}
        gap={2}
        px={2}
        cursor={"pointer"}
      >
        {isMobile && (
          <Flex
            alignItems={"center"}
            onClick={() => {
              onBack();
            }}
          >
            <IoIosArrowBack />
            <Box
              bg={"red"}
              borderRadius={"50%"}
              fontSize={"sm"}
              textAlign={"center"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              width={"auto"}
              height={"auto"}
              minWidth={"24px"}
              minHeight={"24px"}
              padding={"1px"}
            >
              9
            </Box>
          </Flex>
        )}

        <Avatar
          src={participant?.avatar}
          size={"sm"}
          onClick={() => {
            navigate(`/users/${participant?._id}`);
          }}
        />
        <Text display={"flex"} alignItems={"center"}>
          {participant?.username}{" "}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
      </Flex>
      <InfoIcon
        mr={5}
        width={"20px"}
        height={"20px"}
        cursor={"pointer"}
        onClick={() => {
          addEvent({
            event: "open_detail_chat_tab",
            payload: {},
          });
          setOpenDetailTab(!openDetailTab);
        }}
      />
    </Flex>
  );
};

export default ConversationHeader;

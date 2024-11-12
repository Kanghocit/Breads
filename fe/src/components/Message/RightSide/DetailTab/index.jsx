import { LinkIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Container,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaFileAlt } from "react-icons/fa";
import { IoIosSearch, IoMdClose, IoMdPhotos } from "react-icons/io";
import { MdColorLens } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Socket from "../../../../socket";
import { getEmojiIcon, getEmojiNameFromIcon } from "../../../../util";
import { getCurrentTheme } from "../../../../util/Themes";
import EmojiBox from "../Conversation/MessageBar/Emoji/EmojiBox";
import IconWrapper from "../Conversation/MessageBar/IconWrapper";
import ConversationDataTab from "./DataTab";
import ConversationSearchTab from "./SearchMsgTab";

export const TAB_ITEMS = {
  SEARCH: "search",
  THEME: "Change theme",
  EMOJI: "Change emoji",
  MEDIA: "Media",
  FILES: "Files",
  LINKS: "Links",
};

const DetailConversationTab = () => {
  const { SEARCH, THEME, EMOJI, MEDIA, FILES, LINKS } = TAB_ITEMS;
  const navigate = useNavigate();
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const [itemSelected, setItemSelected] = useState("");
  const participant = selectedConversation?.participant;
  const menu = {
    "Customize chat": [
      {
        name: THEME,
        icon: <MdColorLens />,
      },
      {
        name: EMOJI,
        icon: <Text>{getEmojiIcon(selectedConversation?.emoji)}</Text>,
      },
    ],
    "Media, files and links": [
      {
        name: MEDIA,
        icon: <IoMdPhotos />,
      },
      {
        name: FILES,
        icon: <FaFileAlt />,
      },
      {
        name: LINKS,
        icon: <LinkIcon />,
      },
    ],
  };
  const actions = [
    {
      name: "Profile",
      icon: <CgProfile width={"24px"} height={"24px"} />,
      onClick: () => {
        navigate(`/users/${participant?._id}`);
      },
    },
    {
      name: SEARCH,
      icon: <IoIosSearch width={"24px"} height={"24px"} />,
      onClick: () => {
        setItemSelected(SEARCH);
      },
    },
  ];
  const [searchEmojiValue, setSearchEmojiValue] = useState("");
  const { conversationBackground, user1Message } = getCurrentTheme(
    selectedConversation?.theme
  );
  const borderColor = user1Message?.borderColor;

  const handleChangeEmoji = async (emojiStr) => {
    try {
      const socket = Socket.getInstant();
      console.log("emojiStr: ", emojiStr);
    } catch (err) {
      console.error("handleChangeEmoji: ", err);
    }
  };

  const displaySubTab = () => {
    switch (itemSelected) {
      case SEARCH:
        return <ConversationSearchTab setItemSelected={setItemSelected} />;
      case MEDIA:
      case FILES:
      case LINKS:
        return (
          <ConversationDataTab
            currentTab={itemSelected}
            setItemSelected={setItemSelected}
          />
        );
      case EMOJI:
        return (
          <Modal
            isOpen={itemSelected === EMOJI}
            onClose={() => setItemSelected("")}
          >
            <ModalOverlay />
            <ModalContent width={"fit-content"} p={4}>
              <Flex
                alignItems={"center"}
                justifyContent={"space-between"}
                mb={3}
              >
                <InputGroup maxWidth={"160px"} height={"32px"}>
                  <InputLeftElement pointerEvents="none" height={"32px"}>
                    <SearchIcon
                      color="gray.300"
                      height={"16px"}
                      width={"16px"}
                    />
                  </InputLeftElement>
                  <Input
                    type="text"
                    placeholder="Search emoji"
                    height={"32px"}
                    fontSize={"14px"}
                    value={searchEmojiValue}
                    onChange={(e) => setSearchEmojiValue(e.target.value)}
                  />
                </InputGroup>
                <IconWrapper icon={<IoMdClose onClick={() => onClose()} />} />
              </Flex>
              <EmojiBox
                searchValue={searchEmojiValue}
                currentEmoji={getEmojiIcon(selectedConversation?.emoji)}
                onClick={(emojiIcon) =>
                  handleChangeEmoji(getEmojiNameFromIcon(emojiIcon))
                }
              />
            </ModalContent>
          </Modal>
        );
      default:
        return <></>;
    }
  };

  return (
    <Container
      width={"100%"}
      p={0}
      margin={0}
      border={`1px solid ${borderColor ? borderColor : "gray"}`}
      height={"fit-content"}
      borderRadius={"12px"}
      bg={conversationBackground?.backgroundColor}
      backgroundBlendMode={conversationBackground?.backgroundBlendMode}
      color={borderColor ? borderColor : ""}
    >
      {displaySubTab()}
      {(!itemSelected || itemSelected === EMOJI) && (
        <>
          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
            p={8}
            gap={3}
          >
            <Avatar src={participant?.avatar} size={"xl"} />
            <Text fontWeight={"500"} fontSize={"20px"}>
              {participant?.username}
            </Text>
            <Flex gap={4} alignItems={"center"}>
              {actions.map(({ name, icon, onClick }) => (
                <Flex
                  key={name}
                  flexDir={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  gap={1}
                  onClick={onClick}
                >
                  <IconWrapper label={name} icon={icon} />
                  <Text fontSize={"12px"} fontWeight={600}>
                    {name}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
          <Accordion defaultIndex={[0]} allowMultiple>
            {Object.keys(menu).map((itemName) => {
              const subItems = menu[itemName];
              return (
                <AccordionItem key={itemName}>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        {itemName}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={3} px={4}>
                    {subItems.map(({ name, icon }) => (
                      <Flex
                        key={name}
                        py={2}
                        gap={2}
                        alignItems={"center"}
                        cursor={"pointer"}
                        __hover={{
                          bg: "lightgray",
                        }}
                        onClick={() => setItemSelected(name)}
                      >
                        <div>{icon}</div>
                        <Text>{name}</Text>
                      </Flex>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        </>
      )}
    </Container>
  );
};

export default DetailConversationTab;

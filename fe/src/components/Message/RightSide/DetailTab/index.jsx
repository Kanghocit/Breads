import { LinkIcon } from "@chakra-ui/icons";
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
  Text,
} from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";
import { FaFileAlt } from "react-icons/fa";
import { IoIosSearch, IoMdPhotos } from "react-icons/io";
import { MdColorLens, MdThumbUp } from "react-icons/md";
import { useSelector } from "react-redux";
import IconWrapper from "../Conversation/MessageBar/IconWrapper";
import { useNavigate } from "react-router-dom";

const DetailConversationTab = () => {
  const navigate = useNavigate();
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const participant = selectedConversation?.participant;
  const menu = {
    "Customize chat": [
      {
        name: "Change theme",
        icon: <MdColorLens />,
      },
      {
        name: "Change emoji",
        icon: <MdThumbUp />,
      },
    ],
    "Media, files and links": [
      {
        name: "Media",
        icon: <IoMdPhotos />,
      },
      {
        name: "Files",
        icon: <FaFileAlt />,
      },
      {
        name: "Links",
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
      name: "Search",
      icon: <IoIosSearch width={"24px"} height={"24px"} />,
      onClick: () => {},
    },
  ];

  return (
    <Container
      width={"100%"}
      p={0}
      margin={0}
      border={"1px solid gray"}
      height={"fit-content"}
      borderRadius={"12px"}
    >
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
                    py={2}
                    gap={2}
                    alignItems={"center"}
                    cursor={"pointer"}
                    __hover={{
                      bg: "lightgray",
                    }}
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
    </Container>
  );
};

export default DetailConversationTab;

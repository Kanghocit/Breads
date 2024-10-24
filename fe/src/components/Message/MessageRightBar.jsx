import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Avatar,
    Box,
    Button,
    Flex,
    Text,
    useColorModeValue,
  } from "@chakra-ui/react";
  import { CgProfile } from "react-icons/cg";
  import { FaBell } from "react-icons/fa";
  import { IoSearch } from "react-icons/io5";
  import { MdOutlinePushPin } from "react-icons/md";
  import { AiOutlineLike } from "react-icons/ai";
  import { MdOutlinePermMedia } from "react-icons/md";
  import { FaRegFileLines } from "react-icons/fa6";
  
  const MessageRightBar = () => {
    const bgColor = useColorModeValue("cbg.light", "cbg.dark");
    const items = [
      { icon: <CgProfile size={20} />, name: "Profile" },
      { icon: <FaBell size={20} />, name: "Mute" },
      { icon: <IoSearch size={20} />, name: "Search" },
    ];
    const sections = [
      {
        name: "Chat Info",
        item: [{ icon: <MdOutlinePushPin />, text: "View pinned messages" }],
      },
      {
        name: "Customize Chat",
        item: [
          { icon: "Màu", text: "Change theme" },
          { icon: <AiOutlineLike />, text: "Change emoji" },
        ],
      },
      {
        name: "Media & File",
        item: [
          { icon: <MdOutlinePermMedia />, text: "Media" },
          { icon: <FaRegFileLines />, text: "File" },
        ],
      },
    ];
  
    return (
      <Flex flexDirection={"column"} maxHeight={"600px"} overflowY="auto" width={"260px"} bg={bgColor} borderRadius={"10px"} >
        <Flex flexDirection="column" alignItems="center" p={4}>
          <Avatar src="" mb={2} />
          <Flex fontWeight="bold" fontSize="lg">
            Khang
          </Flex>
          <Text fontSize="sm" color="gray.500">
            Active 1h ago
          </Text>
        </Flex>
  
        <Flex mt={4} mx={"auto"} >
          {items.map((item, index) => (
            <Flex
              key={index}
              alignItems="center"
              flexDirection={"column"}
              mb={3}
              p={3}
            >
              <Button borderRadius="50%" width="40px" height="40px" p={0}>
                {item.icon}
              </Button>
              <Text ml={2}>{item.name}</Text>
            </Flex>
          ))}
        </Flex>
  
        <Flex flex={1}>
          <Accordion defaultIndex={[0]} allowMultiple w={"100%"}>
            {sections.map((section, index) => (
              <AccordionItem key={index}>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      {section.name}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  {section.item.map((subItem, subIndex) => (
                    <Flex key={subIndex} alignItems="center" mb={2}>
                      <Box mr={2}>{subItem.icon}</Box>
                      <Text>{subItem.text}</Text>
                    </Flex>
                  ))}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Flex>
      </Flex>
    );
  };
  
  export default MessageRightBar;
  
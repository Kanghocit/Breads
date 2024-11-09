import { Flex, Text } from "@chakra-ui/react";
import { emojiMap } from "../../../../../../../util";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { CloseIcon } from "@chakra-ui/icons";
import IconWrapper from "../../../MessageBar/IconWrapper";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

const MessageReactsBox = ({ reacts }) => {
  const [openDetailBox, setOpenDetailBox] = useState(false);

  return (
    <>
      <Flex
        borderRadius={12}
        bg="lightgray"
        px={"6px"}
        gap={"2px"}
        onClick={() => setOpenDetailBox(true)}
      >
        <Flex>
          {reacts?.map(({ react }) => (
            <Text fontSize={"12px"}>{emojiMap[react].icon}</Text>
          ))}
        </Flex>
        <Text fontSize={"12px"} fontWeight={600} color={"black"}>
          {reacts?.length}
        </Text>
      </Flex>
      <Modal isOpen={openDetailBox} onClose={() => setOpenDetailBox(false)}>
        <ModalOverlay />
        <ModalContent bg={useColorModeValue("gray.200", "#181818")}>
          <ModalHeader borderBottom={"1px solid gray"} pos={"relative"}>
            <Flex alignItems={"center"} justifyContent={"center"}>
              <Text>Message reactions</Text>
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
                      onClick={() => setOpenDetailBox(false)}
                    />
                  }
                />
              </div>
            </Flex>
          </ModalHeader>
          <ModalBody></ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MessageReactsBox;

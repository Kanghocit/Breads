import { SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { IoMdClose } from "react-icons/io";
import { MdEmojiEmotions } from "react-icons/md";
import IconWrapper from "../IconWrapper";
import { ACTIONS, iconStyle } from "..";
import EmojiBox from "./EmojiBox";

const EmojiMsgBtn = ({ popup, closeTooltip, onClose, onOpen }) => {
  return (
    <IconWrapper
      label={closeTooltip ? "" : ACTIONS.EMOJI}
      icon={
        <Popover
          isOpen={popup === ACTIONS.EMOJI}
          placement="top"
          onClose={() => onClose()}
        >
          <PopoverTrigger>
            <Button
              padding={0}
              style={iconStyle}
              bg={"transparent"}
              _hover={{
                bg: "transparent",
              }}
              onClick={() => onOpen(ACTIONS.EMOJI)}
            >
              <MdEmojiEmotions style={iconStyle} />
            </Button>
          </PopoverTrigger>
          <PopoverContent width={"fit-content"}>
            <PopoverHeader
              fontWeight="semibold"
              textAlign={"center"}
              padding={"8px 4px"}
            >
              <Flex alignItems={"center"} justifyContent={"space-between"}>
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
                  />
                </InputGroup>
                <IconWrapper icon={<IoMdClose onClick={() => onClose()} />} />
              </Flex>
            </PopoverHeader>
            <PopoverArrow />
            <PopoverBody padding={"8px 4px"} width={"fit-content"}>
              <EmojiBox />
            </PopoverBody>
          </PopoverContent>
        </Popover>
      }
    />
  );
};

export default EmojiMsgBtn;

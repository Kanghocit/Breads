import {
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { IoMdClose } from "react-icons/io";
import { RiFileGifLine } from "react-icons/ri";
import IconWrapper from "../IconWrapper";
import { ACTIONS, iconStyle } from "..";
import GifMsgBox from "./GifMsgBox";

const GifMsgBtn = ({ popup, onClose, onOpen }) => {
  return (
    <Popover
      isOpen={popup === ACTIONS.GIF}
      placement="top-start"
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
        >
          <RiFileGifLine
            style={iconStyle}
            onClick={() => onOpen(ACTIONS.GIF)}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader
          fontWeight="semibold"
          textAlign={"center"}
          padding={"12px 16px"}
        >
          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <Text>Choose a gif</Text>
            <IconWrapper icon={<IoMdClose onClick={() => onClose()} />} />
          </Flex>
        </PopoverHeader>
        <PopoverArrow />
        <PopoverBody padding={"8px 4px"}>
          <GifMsgBox />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default GifMsgBtn;

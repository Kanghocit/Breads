import { SearchIcon } from "@chakra-ui/icons";
import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import Socket from "../../../../../socket";
import { getEmojiIcon, getEmojiNameFromIcon } from "../../../../../util";
import EmojiBox from "../../Conversation/MessageBar/Emoji/EmojiBox";
import IconWrapper from "../../Conversation/MessageBar/IconWrapper";

const EmojiModal = ({ setItemSelected }) => {
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const [searchEmojiValue, setSearchEmojiValue] = useState("");

  const handleChangeEmoji = async (emojiStr) => {
    try {
      const socket = Socket.getInstant();
      console.log("emojiStr: ", emojiStr);
    } catch (err) {
      console.error("handleChangeEmoji: ", err);
    }
  };

  return (
    <>
      <Flex alignItems={"center"} justifyContent={"space-between"} mb={3}>
        <InputGroup maxWidth={"160px"} height={"32px"}>
          <InputLeftElement pointerEvents="none" height={"32px"}>
            <SearchIcon color="gray.300" height={"16px"} width={"16px"} />
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
        <IconWrapper icon={<IoMdClose onClick={() => setItemSelected("")} />} />
      </Flex>
      <EmojiBox
        searchValue={searchEmojiValue}
        currentEmoji={getEmojiIcon(selectedConversation?.emoji)}
        onClick={(emojiIcon) =>
          handleChangeEmoji(getEmojiNameFromIcon(emojiIcon))
        }
      />
    </>
  );
};

export default EmojiModal;

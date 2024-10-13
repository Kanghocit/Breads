import { Container, Flex, Text } from "@chakra-ui/react";
import { memo } from "react";
import { emojiMap } from "../../../../util";
import IconWrapper from "../IconWrapper";

const EmojiBox = () => {
  const emojis = Object.values(emojiMap).map(({ icon }) => icon);

  return (
    <Container
      padding={0}
      overflowY={"auto"}
      maxHeight={"200px"}
      sx={{
        "&::-webkit-scrollbar": {
          width: "12px",
        },
        "&::-webkit-scrollbar-track": {
          background: "white",
          borderRadius: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "gray",
          borderRadius: "8px",
          border: "3px solid white",
        },
      }}
    >
      <Flex wrap="wrap" width={"180px"} gap={"4px"}>
        {emojis.map((emoji) => (
          <IconWrapper key={emoji} icon={<Text>{emoji}</Text>} />
        ))}
      </Flex>
    </Container>
  );
};

export default memo(EmojiBox);

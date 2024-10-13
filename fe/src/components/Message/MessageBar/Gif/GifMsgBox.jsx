import { Container, Flex, Image } from "@chakra-ui/react";
import { gif } from "../../../../Breads-Shared/Constants/index";
import { memo } from "react";

const GifMsgBox = () => {
  return (
    <Container
      p={0}
      overflowY={"auto"}
      maxHeight={"400px"}
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
      <Flex wrap="wrap">
        {gif.map((link, index) => (
          <Image
            loading="lazy"
            key={link}
            src={link}
            alt={`GIF ${index + 1}`}
            width="45%"
            height="auto"
            borderRadius={"8px"}
            objectFit={"cover"}
            m={1}
            //   onClick={() => handleAddGif(link)}
          />
        ))}
      </Flex>
    </Container>
  );
};

export default memo(GifMsgBox);

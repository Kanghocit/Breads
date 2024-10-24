import { Container, Flex, Image, Text } from "@chakra-ui/react";
import { FILE_TYPES } from "../../../MessageBar/UploadDisplay";

const FileMsg = ({ file }) => {
  const getImgByType = (inputType) => {
    const { word, excel, powerpoint, pdf, text } = FILE_TYPES;
    switch (inputType) {
      case word:
        return "../../../../../../../../FileImgs/word.svg";
      case excel:
        return "../../../../../../../../FileImgs/excel.svg";
      case powerpoint:
        return "../../../../../../../../FileImgs/powerpoint.svg";
      case pdf:
        return "../../../../../../../../FileImgs/pdf.png";
      case text:
        return "../../../../../../../../FileImgs/text.png";
    }
    return "";
  };

  return (
    <Container
      border={"1px solid gray"}
      borderRadius={3}
      padding={3}
      cursor={"pointer"}
      _hover={{
        bg: "gray",
      }}
    >
      <Flex gap={3}>
        <Image
          src={getImgByType(file.contentType)}
          width="32px"
          height="32px"
        />
        <Text
          fontWeight={500}
          fontSize={"14px"}
          textOverflow={"ellipsis"}
          overflow={"hidden"}
          whiteSpace={"nowrap"}
          flex={1}
        >
          {file.name}
        </Text>
      </Flex>
    </Container>
  );
};

export default FileMsg;

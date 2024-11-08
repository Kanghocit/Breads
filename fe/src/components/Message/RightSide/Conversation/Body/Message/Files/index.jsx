import { Container, Flex, Image, Text } from "@chakra-ui/react";
import { FILE_TYPES } from "../../../../../../../util";
import { formatItemDate } from "../../../../../../../util";


const FileMsg = ({ file, inMsgTab = false }) => {
  const { word, excel, powerpoint, pdf, text } = FILE_TYPES;
  const fileType = file.contentType;

  const getImgByType = () => {
    switch (fileType) {
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

  const getLinkByType = () => {
    const url = file?.url;
    switch (fileType) {
      case word:
        return "ms-word:ofe|u|" + url;
      case excel:
        return "ms-excel:ofe|u|" + url;
      case powerpoint:
        return "ms-powerpoint:ofe|u|" + url;
      case pdf:
      case text:
        return url;
    }
    return "";
  };

  const fileDisplay = () => {
    return (
      <Container
        position={"relative"}
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
        {inMsgTab && (
          <Text
            position={"absolute"}
            bottom={"8px"}
            right={"12px"}
            fontSize={"11px"}
          >
            {formatItemDate(file?.createdAt)}
          </Text>
        )}
      </Container>
    );
  };

  const fileWrapperByType = () => {
    const linkType = getLinkByType();
    switch (fileType) {
      case word:
      case excel:
      case powerpoint:
        return (
          <a
            href={linkType}
            style={{
              width: inMsgTab ? "100%" : "",
            }}
          >
            {fileDisplay()}
          </a>
        );
      case text:
      case pdf:
        return (
          <a
            href={linkType}
            target="_blank"
            style={{
              width: inMsgTab ? "100%" : "",
            }}
          >
            {fileDisplay()}
          </a>
        );
    }
  };

  return <>{fileWrapperByType()}</>;
};

export default FileMsg;

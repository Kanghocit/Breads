import { CloseIcon } from "@chakra-ui/icons";
import { Button, Flex, Image, Text, useColorModeValue } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { fileTypes } from "./File";
import { updateMsgInfo } from "../../../../../store/MessageSlice";

export const FILE_TYPES = {
  word: "word",
  excel: "excel",
  powerpoint: "powerpoint",
  pdf: "pdf",
  text: "text",
};

const UploadDisplay = () => {
  //Max 5 files / folders\
  const dispatch = useDispatch();
  const msgInfo = useSelector((state) => state.message.msgInfo);
  const files = msgInfo.files;

  const getImgByType = (inputType) => {
    let fileType = "";
    const types = Object.keys(fileTypes);
    types.forEach((type) => {
      if (fileTypes[type].includes(inputType)) {
        fileType = type;
      }
    });
    const { word, excel, powerpoint, pdf, text } = FILE_TYPES;
    switch (fileType) {
      case word:
        return "../../../../FileImgs/word.svg";
      case excel:
        return "../../../../FileImgs/excel.svg";
      case powerpoint:
        return "../../../../FileImgs/powerpoint.svg";
      case pdf:
        return "../../../../FileImgs/pdf.png";
      case text:
        return "../../../../FileImgs/text.png";
    }
    return "";
  };

  const handleRemoveFile = (fileIndex) => {
    const newFiles = files.filter((_, index) => index !== fileIndex);
    dispatch(
      updateMsgInfo({
        ...msgInfo,
        files: newFiles,
      })
    );
  };

  const handleRemoveAllFiles = () => {
    dispatch(
      updateMsgInfo({
        ...msgInfo,
        files: [],
      })
    );
  };

  return (
    <Flex
      position={"absolute"}
      left={0}
      bottom={"100%"}
      width={"100%"}
      height={"100px"}
      px={2}
      py={3}
      gap={"10px"}
      borderTop={"1px solid gray"}
      justifyContent={"start"}
      alignItems={"center"}
      bg={useColorModeValue("gray.200", "#181818")}
    >
      <>
        {files?.map((file, index) => (
          <Flex
            key={file.name}
            height={"100%"}
            width={"fit-content"}
            padding={"6px"}
            border={"1px solid gray"}
            margin={0}
            flexDirection={"column"}
            justifyContent={"space-between"}
            position={"relative"}
          >
            <CloseIcon
              position={"absolute"}
              top={"-7px"}
              right={"-7px"}
              width={"14px"}
              height={"14px"}
              borderRadius={"50%"}
              bg={"gray"}
              p={"2px"}
              cursor={"pointer"}
              _hover={{
                opacity: 0.8,
              }}
              onClick={() => handleRemoveFile(index)}
            />
            <Image
              src={getImgByType(file.contentType)}
              width={"100%"}
              maxHeight={"calc(100% - 16px)"}
              objectFit={"contain"}
            />
            <Text
              maxWidth={"50px"}
              fontSize={"11px"}
              textOverflow={"ellipsis"}
              overflow={"hidden"}
              whiteSpace={"nowrap"}
            >
              {file.name}
            </Text>
          </Flex>
        ))}
      </>
      <Button padding={"8px 12px"} onClick={() => handleRemoveAllFiles()}>
        Clear all
      </Button>
    </Flex>
  );
};

export default UploadDisplay;

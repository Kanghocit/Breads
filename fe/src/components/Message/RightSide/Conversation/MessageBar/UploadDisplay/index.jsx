import { CloseIcon } from "@chakra-ui/icons";
import { Button, Flex, Image, Text, useColorModeValue } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { fileTypes } from "../File";
import { updateMsgInfo } from "../../../../../../store/MessageSlice";
import LoadingUploadMsg from "./loading";
import ItemUploadDisplay from "./ItemUploadDisplay";

export const FILE_TYPES = {
  word: "word",
  excel: "excel",
  powerpoint: "powerpoint",
  pdf: "pdf",
  text: "text",
};

const UploadDisplay = () => {
  //Max 5 files / folders
  const dispatch = useDispatch();
  const { msgInfo, loadingUploadMsg } = useSelector((state) => state.message);
  const files = msgInfo.files;
  const media = msgInfo.media;

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

  const handleRemoveMedia = (mediaIndex) => {
    const newMedia = media.filter((_, index) => index !== mediaIndex);
    dispatch(
      updateMsgInfo({
        ...msgInfo,
        media: newMedia,
      })
    );
  };

  const handleRemoveAllFiles = () => {
    dispatch(
      updateMsgInfo({
        ...msgInfo,
        files: [],
        media: [],
      })
    );
  };

  return (
    <Flex
      position={"absolute"}
      left={0}
      bottom={"calc(100% - 2px)"}
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
        {media?.map((item, index) => (
          <ItemUploadDisplay
            item={item}
            imgSrc={item?.url}
            onClick={() => {
              handleRemoveMedia(index);
            }}
          />
        ))}
        {files?.map((file, index) => (
          <ItemUploadDisplay
            item={file}
            imgSrc={getImgByType(file.contentType)}
            onClick={() => handleRemoveFile(index)}
          />
        ))}
      </>
      <Button padding={"8px 12px"} onClick={() => handleRemoveAllFiles()}>
        Clear all
      </Button>
      {loadingUploadMsg && <LoadingUploadMsg />}
    </Flex>
  );
};

export default UploadDisplay;

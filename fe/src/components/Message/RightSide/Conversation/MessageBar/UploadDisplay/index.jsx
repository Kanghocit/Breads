import { Button, Flex, useColorModeValue } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateMsgInfo } from "../../../../../../store/MessageSlice";
import { updatePostInfo } from "../../../../../../store/PostSlice";
import { FILE_TYPES, fileTypes } from "../../../../../../util";
import ItemUploadDisplay from "./ItemUploadDisplay";
import LoadingUploadMsg from "./loading";
const UploadDisplay = (isPost = false) => {
  //Max 5 files / folders
  const dispatch = useDispatch();
  const { msgInfo, loadingUploadMsg } = useSelector((state) => state.message);
  const { postInfo } = useSelector((state) => state.post);

  const files = isPost ? postInfo.files : msgInfo.files;
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
    if (!isPost) {
      dispatch(
        updateMsgInfo({
          ...msgInfo,
          files: newFiles,
        })
      );
    }
    if (isPost) {
      dispatch(
        updatePostInfo({
          ...postInfo,
          files: newFiles,
        })
      );
    }
  };

  const handleRemoveAllFiles = () => {
    if (!isPost) {
      dispatch(
        updateMsgInfo({
          ...msgInfo,
          files: [],
        })
      );
    }
    if (isPost) {
      dispatch(
        updatePostInfo({
          ...postInfo,
          files: [],
        })
      );
    }
  };

  const baseStyles = {
    width: "100%",
    px: 2,
    py: 3,
    gap: "10px",
    justifyContent: "start",
    bg: useColorModeValue("gray.200", "#181818"),
  };
  const postStyles = {
    position: "relative",
    height: "100px",
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
  };

  const nonPostStyles = {
    borderTop: "1px solid gray",
    position: "absolute",
    left: 0,
    bottom: "calc(100% - 2px)",
    height: "100px",
    justifyContent: "start",
    alignItems: "center",
    flexDirection: "row",
  };
  return (
    <Flex {...baseStyles} {...(isPost ? postStyles : nonPostStyles)}>
      <>
        {!isPost &&
          media?.map((item, index) => (
            <ItemUploadDisplay
              item={item}
              imgSrc={item?.url}
              onClick={() => {}}
              key={index}
            />
          ))}
        {files?.map((file, index) => (
          <ItemUploadDisplay
            item={file}
            imgSrc={getImgByType(file.contentType)}
            onClick={() => handleRemoveFile(index)}
            key={index}
            isPost={isPost}
          />
        ))}
      </>
      {!isPost ? (
        <Button padding={"8px 12px"} onClick={() => handleRemoveAllFiles()}>
          Clear all
        </Button>
      ) : (
        <></>
      )}
      {loadingUploadMsg && <LoadingUploadMsg />}
    </Flex>
  );
};

export default UploadDisplay;

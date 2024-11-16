import { Button, Flex } from "@chakra-ui/react";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fileTypes } from "../../../../../../Breads-Shared/Constants";
import { updateMsgInfo } from "../../../../../../store/MessageSlice";
import { updatePostInfo } from "../../../../../../store/PostSlice";
import { FILE_TYPES } from "../../../../../../util";
import { getCurrentTheme } from "../../../../../../util/Themes";
import ItemUploadDisplay from "./ItemUploadDisplay";
import LoadingUploadMsg from "./loading";

const UploadDisplay = ({ isPost = false }) => {
  //Max 5 files / folders
  const dispatch = useDispatch();
  const { msgInfo, loadingUploadMsg, selectedConversation } = useSelector(
    (state) => state.message
  );
  const { conversationBackground } = getCurrentTheme(
    selectedConversation?.theme
  );
  const bg = conversationBackground?.backgroundColor;
  const { postInfo } = useSelector((state) => state.post);
  const media = msgInfo.media;
  const files = isPost ? postInfo.files : msgInfo.files;
  const baseStyles = {
    width: "100%",
    px: 2,
    py: 3,
    gap: "10px",
    justifyContent: "start",
    bg: loadingUploadMsg ? "gray" : bg ? bg : "",
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
    // position: "absolute",
    // left: 0,
    // bottom: "calc(100% - 2px)",
    height: "100px",
    justifyContent: "start",
    alignItems: "center",
    flexDirection: "row",
  };

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

  const handleRemoveMedia = (mediaIndex) => {
    const newMedia = media.filter((_, index) => index !== mediaIndex);
    dispatch(
      updateMsgInfo({
        ...msgInfo,
        media: newMedia,
      })
    );
  };

  const handleRemoveAll = () => {
    if (!isPost) {
      dispatch(
        updateMsgInfo({
          ...msgInfo,
          files: [],
          media: [],
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

  return (
    <Flex {...baseStyles} {...(isPost ? postStyles : nonPostStyles)}>
      <>
        {media?.map((item, index) => (
          <ItemUploadDisplay
            item={item}
            imgSrc={item?.url}
            onClick={() => {
              handleRemoveMedia(index);
            }}
            key={index}
            isPost={isPost}
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
        <Button padding={"8px 12px"} onClick={() => handleRemoveAll()}>
          Clear all
        </Button>
      ) : (
        <></>
      )}
      {loadingUploadMsg && <LoadingUploadMsg />}
    </Flex>
  );
};

export default memo(UploadDisplay);

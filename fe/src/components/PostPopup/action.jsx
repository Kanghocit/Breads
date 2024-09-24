import { Flex, Input, useDisclosure } from "@chakra-ui/react";
import { useRef } from "react";
import { RiFileGifLine } from "react-icons/ri";
import { TbLibraryPhoto } from "react-icons/tb";
import { VscListSelection } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Constants } from "../../../../share/Constants";
import { surveyTemplate, updatePostInfo } from "../../store/PostSlice";
import { convertToBase64 } from "../../util";
import PostMedia from "./media";

const PostPopupAction = () => {
  const dispatch = useDispatch();
  const postInfo = useSelector((state) => state.post.postInfo);
  const imageRef = useRef(null);
  const {isOpen, onOpen, onClose } = useDisclosure();

  const handleAddMedia = async (img) => {
    const base64 = await convertToBase64(img);
    dispatch(
      updatePostInfo({
        ...postInfo,
        media: [
          {
            url: base64,
            type: img.type.includes("image")
              ? Constants.MEDIA_TYPE.IMAGE
              : Constants.MEDIA_TYPE.VIDEO,
          },
        ],
      })
    );
  };

  const handleAddSurvey = () => {
    dispatch(
      updatePostInfo({
        ...postInfo,
        survey: [
          surveyTemplate({ placeholder: "Yes", value: "" }),
          surveyTemplate({ placeholder: "No", value: "" }),
          surveyTemplate({ placeholder: "More option", value: "" }),
        ],
      })
    );
  };

  return (
    <>
      <Input
        type="file"
        hidden
        ref={imageRef}
        onChange={(e) => {
          handleAddMedia(e.target.files[0]);
        }}
      />
      <Flex gap="10px" padding="8px 0" direction={"column"} position="relative">
        <Flex maxWidth="100%" gap="10px">
          <TbLibraryPhoto
            cursor="pointer"
            onClick={() => imageRef.current.click()}
          />
          <RiFileGifLine cursor="pointer" onClick={onOpen} />
          <VscListSelection
            cursor="pointer"
            onClick={() => handleAddSurvey()}
          />
        </Flex>
      </Flex>
      <PostMedia isOpen={isOpen} onClose={onClose}/>
    </>
  );
};

export default PostPopupAction;

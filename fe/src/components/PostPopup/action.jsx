import { CloseButton, Flex, Input } from "@chakra-ui/react";
import { TbLibraryPhoto } from "react-icons/tb";
import { RiFileGifLine } from "react-icons/ri";
import { VscListSelection } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { surveyTemplate, updatePostInfo } from "../../store/PostSlice";
import usePreviewImg from "../../hooks/usePreviewImg";
import { useRef } from "react";
import { Image } from "@chakra-ui/react";

const PostPopupAction = () => {
  const dispatch = useDispatch();
  const postInfo = useSelector((state) => state.post.postInfo);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);

  const handleAddMedia = () => {
    
    dispatch(
      updatePostInfo({
        ...postInfo,
        media: { url: imgUrl },
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
      <Input type="file" hidden ref={imageRef} onChange={handleImageChange} />
      <Flex gap="10px" padding="8px 0" direction={"column"} position="relative">
        {imgUrl && (
          <Flex display="inline-flex">
            <Image src={imgUrl} alt="Preview" />
            <CloseButton
              onClick={() => {
                setImgUrl(null);
                dispatch(
                  updatePostInfo({
                    ...postInfo,
                    media: null,  
                  })
                );
              }}
              position="absolute"
              top={3}
              right={3}
              borderRadius="50%"
            />
          </Flex>
        )}

        <Flex maxWidth="100%" gap="10px">
          <TbLibraryPhoto
            cursor="pointer"
            onClick={() => imageRef.current.click()}
          />
          <RiFileGifLine cursor="pointer" />
          <VscListSelection
            cursor="pointer"
            onClick={() => handleAddSurvey()}
          />
        </Flex>
      </Flex>
    </>
  );
};

export default PostPopupAction;

import { Flex } from "@chakra-ui/react";
import { TbLibraryPhoto } from "react-icons/tb";
import { RiFileGifLine } from "react-icons/ri";
import { VscListSelection } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { surveyTemplate, updatePostInfo } from "../../store/PostSlice";

const PostPopupAction = () => {
  const dispatch = useDispatch();
  const postInfo = useSelector((state) => state.post.postInfo);

  const handleAddMedia = () => {};

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
    <Flex gap="10px" padding="8px 0">
      <TbLibraryPhoto cursor={"pointer"} />
      <RiFileGifLine cursor={"pointer"} />
      <VscListSelection cursor={"pointer"} onClick={() => handleAddSurvey()} />
    </Flex>
  );
};

export default PostPopupAction;

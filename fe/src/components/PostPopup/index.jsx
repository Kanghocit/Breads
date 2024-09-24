import {
  Avatar,
  Button,
  Container,
  Flex,
  Image,
  Modal,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../../hooks/useDebounce";
import usePopupCancel from "../../hooks/usePopupCancel";
import useShowToast from "../../hooks/useShowToast";
import {
  defaultPostInfo,
  updatePostAction,
  updatePostInfo,
} from "../../store/PostSlice";
import { createPost, editPost } from "../../store/PostSlice/asyncThunk";
import { replaceEmojis } from "../../util";
import PopupCancel from "../../util/PopupCancel";
import TextArea from "../../util/TextArea";
import PostPopupAction from "./action";
import PostSurvey from "./survey";
import { Constants } from "../../../../share/Constants";
import PostConstants from "../../util/PostConstants";

const PostPopup = () => {
  const dispatch = useDispatch();
  const { postInfo, postAction, postSelected } = useSelector(
    (state) => state.post
  );
  const isEditing = postAction === PostConstants.ACTIONS.EDIT;
  const userInfo = useSelector((state) => state.user.userInfo);
  const showToast = useShowToast();
  const { popupCancelInfo, setPopupCancelInfo, closePopupCancel } =
    usePopupCancel();
  const [content, setContent] = useState("");
  const debounceContent = useDebounce(content);
  const [clickPost, setClickPost] = useState(false);

  useEffect(() => {
    if (!!debounceContent) {
      dispatch(
        updatePostInfo({
          ...postInfo,
          content: replaceEmojis(debounceContent),
        })
      );
    }
  }, [debounceContent]);

  useEffect(() => {
    if (isEditing && postInfo?._id) {
      setContent(postInfo.content);
    }
  }, [postInfo?._id]);

  const closePostAction =
    !!postInfo.media?.length > 0 || postInfo.survey.length !== 0;

  const checkUploadCondition = () => {
    let checkResult = true;
    let msg = "";
    if (postInfo.survey.length) {
      const optionsValue = postInfo.survey.map(({ value }) => value);
      const setValue = new Set(optionsValue);
      const postSurvey = postInfo.survey.filter(
        (option) => !!option.value.trim()
      );
      if ([setValue].length < postSurvey.length) {
        checkResult = false;
        msg = "Each option should be an unique value";
      }
    }
    return {
      checkCondition: checkResult,
      msg: msg,
    };
  };

  const handleUploadPost = async () => {
    try {
      const payload = {
        authorId: userInfo._id,
        ...postInfo,
      };
      if (isEditing) {
        dispatch(editPost(payload));
      } else {
        dispatch(createPost(payload));
      }
    } catch (err) {
      console.error(err);
      showToast("Error", err, "error");
    }
  };

  const handleClose = () => {
    const { media, survey, content } = postInfo;
    if (!!media.length || !!survey.length || !!content.length) {
      setPopupCancelInfo({
        open: true,
        title: isEditing ? "Stop Editing" : "Stop Creating",
        content: `Do you want to stop ${
          isEditing ? "editing" : "creating"
        } this bread ?`,
        leftBtnText: "Cancel",
        rightBtnText: "Discard",
        leftBtnAction: () => {
          closePopupCancel();
        },
        rightBtnAction: () => {
          dispatch(updatePostAction());
          dispatch(updatePostInfo(defaultPostInfo));
        },
      });
    } else {
      dispatch(updatePostAction());
    }
  };

  return (
    <>
      <Modal
        isOpen={true}
        onClose={() => {
          handleClose();
        }}
      >
        <ModalOverlay />
        <ModalContent
          position={"relative"}
          boxSizing="border-box"
          width="620px"
          maxWidth={"620px"}
          bg={"white"}
          color={"gray"}
          padding="24px"
          borderRadius={"16px"}
          id="modal"
        >
          <Text
            position={"absolute"}
            top={"-36px"}
            left={"50%"}
            transform={"translateX(-50%)"}
            color={"white"}
            zIndex={4000}
            textTransform={"capitalize"}
            fontWeight={600}
            fontSize={"18px"}
          >
            {postAction + " Bread"}
          </Text>
          <Flex>
            <Avatar src={userInfo.avatar} width={"40px"} height={"40px"} />
            <Container margin="0" paddingRight={0}>
              <Text color="black" fontWeight={"600"}>
                {userInfo.username}
              </Text>
              <TextArea
                text={content}
                setText={(value) => setContent(replaceEmojis(value))}
              />
              {postInfo.media[0]?.url && (
                <>
                  {postInfo.media[0].type === Constants.MEDIA_TYPE.VIDEO ? (
                    <video
                      src={postInfo.media[0].url}
                      alt="Post Media"
                      controls
                      style={{
                        width: "100%",
                      }}
                    />
                  ) : (
                    <Image
                      src={postInfo.media[0].url}
                      alt="Post Media"
                      mt={3}
                      width={"100%"}
                    />
                  )}
                </>
              )}
              {!closePostAction && <PostPopupAction />}
              {postInfo.survey.length !== 0 && <PostSurvey />}
            </Container>
          </Flex>
          <ModalFooter padding="0">
            <Button
              isLoading={clickPost}
              loadingText={isEditing ? "Saving" : "Posting"}
              mt={"6px"}
              mr={"16px"}
              colorScheme="white"
              border={"1px solid lightgray"}
              borderRadius={"6px"}
              onClick={() => {
                const { checkCondition, msg } = checkUploadCondition();
                if (!checkCondition) {
                  showToast("Error", msg, "error");
                  return;
                }
                setClickPost(true);
                handleUploadPost();
              }}
            >
              {isEditing ? "Save" : "Post"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {popupCancelInfo.open && (
        <PopupCancel popupCancelInfo={popupCancelInfo} />
      )}
    </>
  );
};

export default PostPopup;

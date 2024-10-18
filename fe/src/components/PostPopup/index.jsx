import {
  Avatar,
  Button,
  Container,
  Flex,
  Modal,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../../hooks/useDebounce";
import usePopupCancel from "../../hooks/usePopupCancel";
import useShowToast from "../../hooks/useShowToast";
import {
  defaultPostInfo,
  selectPost,
  selectPostReply,
  updatePostAction,
  updatePostInfo,
} from "../../store/PostSlice";
import { createPost, editPost } from "../../store/PostSlice/asyncThunk";
import { replaceEmojis } from "../../util";
import PopupCancel from "../../util/PopupCancel";
import PostConstants from "../../util/PostConstants";
import TextArea from "../../util/TextArea";
import Post from "../ListPost/Post";
import PostPopupAction from "./action";
import MediaDisplay from "./mediaDisplay";
import PostReplied from "./PostReplied";
import PostSurvey from "./survey";

const PostPopup = () => {
  const bgColor = useColorModeValue("cbg.light", "cbg.dark");
  const textColor = useColorModeValue("ccl.dark", "ccl.light");
  const dispatch = useDispatch();
  const { postInfo, postAction, postSelected, postReply } = useSelector(
    (state) => state.post
  );
  const isEditing = postAction === PostConstants.ACTIONS.EDIT;
  const userInfo = useSelector((state) => state.user.userInfo);
  const showToast = useShowToast();
  const { popupCancelInfo, setPopupCancelInfo, closePopupCancel } =
    usePopupCancel();

  const [content, setContent] = useState("");
  const debounceContent = useDebounce(content, 500);
  const [clickPost, setClickPost] = useState(false);
  const init = useRef(true);

  useEffect(() => {
    if (debounceContent !== postInfo.content) {
      dispatch(
        updatePostInfo({ ...postInfo, content: replaceEmojis(debounceContent) })
      );
    }
  }, [debounceContent, dispatch, postInfo]);

  useEffect(() => {
    if (
      isEditing &&
      postInfo?._id &&
      postInfo.content !== content &&
      init.current
    ) {
      setContent(postInfo.content);
      init.current = false;
    }
  }, [isEditing, postInfo, content]);

  const closePostAction =
    !!postInfo.media?.length || postInfo.survey.length !== 0;

  const checkUploadCondition = useCallback(() => {
    let checkResult = true;
    let msg = "";

    //Check condition for survey
    if (postInfo.survey.length) {
      const optionsValue = postInfo.survey.map(({ value }) => value);
      const setValue = new Set(optionsValue);
      const postSurvey = postInfo.survey.filter(
        (option) => !!option.value.trim()
      );

      if ([...setValue].length < postSurvey.length) {
        checkResult = false;
        msg = "Each option should be a unique value";
      }
    }
    if (
      !postInfo.content.trim() &&
      postInfo.survey.length === 0 &&
      postInfo.media.length === 0
    ) {
      checkResult = false;
      msg = "Can't upload new bread with empty payload";
    }

    return { checkCondition: checkResult, msg };
  }, [postInfo]);

  const handleUploadPost = async () => {
    try {
      const payload = {
        authorId: userInfo._id,
        type: postAction,
        ...postInfo,
      };
      if (isEditing) {
        dispatch(editPost(payload));
      } else {
        if (postAction === PostConstants.ACTIONS.REPOST) {
          payload.quote = {
            _id: postSelected._id,
            content: `${postSelected.authorInfo.username}: ${postSelected.content}`,
          };
          payload.parentPost = postSelected._id;
        } else if (postAction === PostConstants.ACTIONS.REPLY) {
          payload.parentPost = postReply._id;
        }
        if (payload.usersTag?.length) {
          let usersId = payload.usersTag.map(({ userId }) => userId);
          usersId = new Set(usersId);
          payload.usersTag = [...usersId];
        }
        dispatch(createPost({ postPayload: payload, action: postAction }));
      }
    } catch (err) {
      console.error(err);
      showToast("Error", err.message, "error");
    }
  };

  const handleClose = () => {
    const { media, survey, content } = postInfo;

    if (media.length || survey.length || content.length) {
      setPopupCancelInfo({
        open: true,
        title: isEditing ? "Stop Editing" : "Stop Creating",
        content: `Do you want to stop ${
          isEditing ? "editing" : "creating"
        } this bread?`,
        leftBtnText: "Cancel",
        rightBtnText: "Discard",
        leftBtnAction: closePopupCancel,
        rightBtnAction: () => {
          dispatch(updatePostAction());
          dispatch(updatePostInfo(defaultPostInfo));
          postAction === PostConstants.ACTIONS.REPLY
            ? dispatch(selectPostReply(null))
            : dispatch(selectPost(null));
        },
      });
    } else {
      dispatch(updatePostAction());
      postAction === PostConstants.ACTIONS.REPLY
        ? dispatch(selectPostReply(null))
        : dispatch(selectPost(null));
    }
  };

  const handleContent = (value) => {
    setContent(replaceEmojis(value));
  };

  return (
    <>
      <Modal isOpen={true} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent
          position="relative"
          boxSizing="border-box"
          width="620px"
          maxWidth="620px"
          bg={bgColor}
          color={textColor}
          padding="24px"
          borderRadius="16px"
          zIndex={3000}
        >
          {postReply?._id && postAction === PostConstants.ACTIONS.REPLY && (
            <div style={{ marginBottom: "12px" }}>
              <PostReplied />
            </div>
          )}
          <Text
            position="absolute"
            top="-36px"
            left="50%"
            transform="translateX(-50%)"
            color={textColor}
            textTransform="capitalize"
            fontWeight={600}
            fontSize="18px"
          >
            {postAction + " Bread"}
          </Text>
          <Flex>
            <Avatar src={userInfo.avatar} width="40px" height="40px" />
            <Container margin="0" paddingRight={0}>
              <Text color={textColor} fontWeight="600">
                {userInfo.username}
              </Text>
              <TextArea
                text={content}
                setText={(value) => handleContent(value)}
                tagUsers={true}
              />
              <MediaDisplay post={postInfo} />
              {!closePostAction && <PostPopupAction />}
              {postInfo.survey.length !== 0 && <PostSurvey />}
              {postSelected?._id &&
                postAction === PostConstants.ACTIONS.REPOST && (
                  <Post post={postSelected} isParentPost={true} />
                )}
            </Container>
          </Flex>
          <ModalFooter padding="0">
            <Button
              isLoading={clickPost}
              loadingText={isEditing ? "Saving" : "Posting"}
              mt="6px"
              mr="16px"
              color={textColor}
              borderRadius="6px"
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

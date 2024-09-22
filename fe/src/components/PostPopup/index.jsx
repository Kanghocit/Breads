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
import { updatePostAction, updatePostInfo } from "../../store/PostSlice";
import { createPost } from "../../store/PostSlice/asyncThunk";
import { replaceEmojis } from "../../util";
import PopupCancel from "../../util/PopupCancel";
import TextArea from "../../util/TextArea";
import PostPopupAction from "./action";
import PostSurvey from "./survey";
import useShowToast from "../../hooks/useShowToast";

const PostPopup = () => {
  const dispatch = useDispatch();
  const { postInfo, postAction } = useSelector((state) => state.post);
  const showToast = useShowToast();
  const { popupCancelInfo, setPopupCancelInfo, closePopupCancel } =
    usePopupCancel();
  const userInfo = useSelector((state) => state.user.userInfo);
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

  const closePostAction =
    !!postInfo.media?.length > 0 || postInfo.survey.length !== 0;

  const handleCreatePost = async () => {
    try {
      const payload = {
        authorId: userInfo._id,
        ...postInfo,
      };
      dispatch(createPost(payload));
      // showToast("", "Posting success", "success");
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
        title: "Stop Creating",
        content: "Do you want to stop creating this post ?",
        leftBtnText: "Cancel",
        rightBtnText: "Discard",
        leftBtnAction: () => {
          closePopupCancel();
        },
        rightBtnAction: () => {
          dispatch(updatePostAction());
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
                <Image src={postInfo.media[0].url} alt="Post Media" mt={4} />
              )}
              {!closePostAction && <PostPopupAction />}
              {postInfo.survey.length !== 0 && <PostSurvey />}
            </Container>
          </Flex>
          <ModalFooter padding="0">
            <Button
              isLoading={clickPost}
              loadingText="Posting"
              mt={"6px"}
              mr={"16px"}
              colorScheme="white"
              border={"1px solid lightgray"}
              borderRadius={"6px"}
              onClick={() => {
                setClickPost(true);
                handleCreatePost();
              }}
            >
              Post
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

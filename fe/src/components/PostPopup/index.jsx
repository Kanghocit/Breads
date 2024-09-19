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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../../hooks/useDebounce";
import { updatePostAction, updatePostInfo } from "../../store/PostSlice";
import { createPost } from "../../store/PostSlice/asyncThunk";
import { replaceEmojis } from "../../util";
import TextArea from "../../util/TextArea";
import PostPopupAction from "./action";
import PostSurvey from "./survey";

const PostPopup = () => {
  const dispatch = useDispatch();
  const { postInfo, postAction } = useSelector((state) => state.post);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [content, setContent] = useState("");
  const debounceContent = useDebounce(content);

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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => {
        dispatch(updatePostAction());
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
            {!closePostAction && <PostPopupAction />}
            {postInfo.survey.length !== 0 && <PostSurvey />}
          </Container>
        </Flex>
        <ModalFooter padding="0">
          <Button
            mt={"6px"}
            mr={"16px"}
            colorScheme="white"
            border={"1px solid lightgray"}
            borderRadius={"6px"}
            onClick={() => {
              handleCreatePost();
            }}
          >
            Post
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PostPopup;

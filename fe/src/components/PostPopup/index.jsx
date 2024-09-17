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
import TextArea from "../../util/TextArea";
import PostPopupAction from "./action";
import PostSurvey from "./survey";

const PostPopup = () => {
  const dispatch = useDispatch();
  const postInfo = useSelector((state) => state.post.postInfo);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [content, setContent] = useState("");
  const debounceContent = useDebounce(content);

  useEffect(() => {
    if (!!debounceContent) {
      dispatch(
        updatePostInfo({
          ...postInfo,
          content: debounceContent,
        })
      );
    }
  }, [debounceContent]);

  const closePostAction = !!postInfo.media.url || postInfo.survey.length !== 0;

  return (
    <Modal
      isOpen={true}
      onClose={() => {
        dispatch(updatePostAction());
      }}
    >
      <ModalOverlay />
      <ModalContent
        boxSizing="border-box"
        width="620px"
        maxWidth={"620px"}
        bg={"white"}
        color={"gray"}
        padding="24px"
        borderRadius={"16px"}
        id="modal"
      >
        <Flex>
          <Avatar src={userInfo.avatar} width={"40px"} height={"40px"} />
          <Container margin="0">
            <Text color="black" fontWeight={"600"}>
              {userInfo.username}
            </Text>
            <TextArea text={content} setText={(value) => setContent(value)} />
            {!closePostAction && <PostPopupAction />}
            {postInfo.survey.length !== 0 && <PostSurvey />}
          </Container>
        </Flex>
        <ModalFooter padding="0">
          <Button
            mt={"6px"}
            mr={"32px"}
            colorScheme="white"
            border={"1px solid lightgray"}
            borderRadius={"6px"}
            onClick={() => {}}
          >
            Post
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PostPopup;

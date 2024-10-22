import {
  Avatar,
  Container,
  Flex,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Constants } from "../../Breads-Shared/Constants";
import Survey from "../ListPost/Post/Survey";
import MediaDisplay from "./mediaDisplay";

const PostReplied = () => {
  const postReply = useSelector((state) => state.post.postReply);
  const textColor = useColorModeValue("ccl.dark", "ccl.light");

  return (
    <>
      <Flex>
        <Avatar
          src={postReply.authorInfo.avatar}
          width={"40px"}
          height={"40px"}
        />
        <Container margin="0" paddingRight={0}>
          <Text color={textColor} fontWeight={"600"}>
            {postReply.authorInfo.username}
          </Text>
          <Text>{postReply.content}</Text>
          <MediaDisplay post={postReply} />
          {postReply.survey.length !== 0 && <Survey post={postReply} />}
        </Container>
      </Flex>
    </>
  );
};

export default PostReplied;

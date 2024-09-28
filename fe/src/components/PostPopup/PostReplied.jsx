import { Avatar, Container, Flex, Image, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Constants } from "../../../../share/Constants";
import Survey from "../Post/Survey";

const PostReplied = () => {
  const postReply = useSelector((state) => state.post.postReply);
  return (
    <>
      <Flex>
        <Avatar
          src={postReply.authorInfo.avatar}
          width={"40px"}
          height={"40px"}
        />
        <Container margin="0" paddingRight={0}>
          <Text color="black" fontWeight={"600"}>
            {postReply.authorInfo.username}
          </Text>
          <Text>{postReply.content}</Text>
          {postReply.media[0]?.url && (
            <>
              {postReply.media[0].type === Constants.MEDIA_TYPE.VIDEO ? (
                <video
                  src={postReply.media[0].url}
                  alt="postReply Media"
                  controls
                  style={{
                    width: "100%",
                  }}
                />
              ) : (
                <Image
                  src={postReply.media[0].url}
                  alt="postReply Media"
                  width={"100%"}
                />
              )}
            </>
          )}
          {postReply.survey.length !== 0 && <Survey post={postReply} />}
        </Container>
      </Flex>
    </>
  );
};

export default PostReplied;

import { Avatar, Container, Flex, Image, Text } from "@chakra-ui/react";
import { Constants } from "../../../../share/Constants";
import TextArea from "../../util/TextArea";
import Survey from "../Post/Survey";

const PostReplied = ({ post }) => {
  return (
    <>
      <Flex>
        <Avatar src={post.authorInfo.avatar} width={"40px"} height={"40px"} />
        <Container margin="0" paddingRight={0}>
          <Text color="black" fontWeight={"600"}>
            {post.authorInfo.username}
          </Text>
          <TextArea text={post.content} />
          {post.media[0]?.url && (
            <>
              {post.media[0].type === Constants.MEDIA_TYPE.VIDEO ? (
                <video
                  src={post.media[0].url}
                  alt="Post Media"
                  controls
                  style={{
                    width: "100%",
                  }}
                />
              ) : (
                <Image
                  src={post.media[0].url}
                  alt="Post Media"
                  width={"100%"}
                />
              )}
            </>
          )}
          {post.survey.length !== 0 && <Survey post={post} />}
        </Container>
      </Flex>
    </>
  );
};

export default PostReplied;

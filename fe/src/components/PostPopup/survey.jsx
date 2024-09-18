import { Collapse, Container, Flex, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { updatePostInfo } from "../../store/PostSlice";
import SurveyOption from "./survey-option";

const PostSurvey = () => {
  const dispatch = useDispatch();
  const postInfo = useSelector((state) => state.post.postInfo);
  const survey = postInfo.survey;

  const handleRemoveSurvey = () => {
    dispatch(
      updatePostInfo({
        ...postInfo,
        survey: [],
      })
    );
  };

  return (
    <Collapse in={true}>
      <Container margin={0} padding={0}>
        {survey.map((item, index) => (
          <SurveyOption key={`survey-${index}`} option={item} index={index} />
        ))}
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          margin={"4px 0"}
        >
          <Text fontSize={"13px"} fontWeight={400}>
            End after 24 hours
          </Text>
          <Text
            fontSize={"13px"}
            fontWeight={600}
            cursor={"pointer"}
            onClick={() => handleRemoveSurvey()}
          >
            Remove this survey
          </Text>
        </Flex>
      </Container>
    </Collapse>
  );
};

export default PostSurvey;

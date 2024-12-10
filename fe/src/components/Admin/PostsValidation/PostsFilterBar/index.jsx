import {
  Checkbox,
  Container,
  Flex,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { Constants } from "../../../../Breads-Shared/Constants";
import PostConstants from "../../../../Breads-Shared/Constants/PostConstants";

export const filterPostWidth = 360;

const PostsFilterBar = () => {
  const postType = Object.values(PostConstants.ACTIONS);
  const postContentInclude = ["text", ...Object.values(Constants.MEDIA_TYPE)];

  const [filter, setFilter] = useState({
    users: [],
    postContent: [],
    postType: [],
  });

  const handleChangeFilterContent = (contentInclude) => {
    let newPostContent = [];
    if (filter.postContent.includes(contentInclude)) {
      newPostContent = filter.postContent.filter(
        (item) => item !== contentInclude
      );
    } else {
      newPostContent = [...filter.postContent, contentInclude];
    }
    setFilter({
      ...filter,
      postContent: newPostContent,
    });
  };

  const handleChangeFilterType = (type) => {
    let newPostType = [];
    if (filter.postType.includes(type)) {
      newPostType = filter.postType.filter((item) => item !== type);
    } else {
      newPostType = [...filter.postType, type];
    }
    setFilter({
      ...filter,
      postType: newPostType,
    });
  };

  return (
    <Flex
      width={`${filterPostWidth}px`}
      borderX={"1px solid gray"}
      flexDir={"column"}
      pos={"fixed"}
      height={"100vh"}
    >
      <Container borderBottom={"1px solid gray"}>
        <Text m={3} fontSize={26} fontWeight={600}>
          Filter
        </Text>
      </Container>
      <Flex p={2} flexDir={"column"}>
        <Container>
          <Text my={2} fontSize={18} fontWeight={600}>
            Users
          </Text>
          <Select placeholder="Select option">
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
        </Container>
      </Flex>
      <Flex p={2} flexDir={"column"}>
        <Container>
          <Text my={2} fontSize={18} fontWeight={600}>
            Post content includes:{" "}
          </Text>
          <Stack spacing={3} direction={"column"}>
            {postContentInclude.map((type) => (
              <Checkbox
                size="md"
                colorScheme="green"
                key={type}
                textTransform={"capitalize"}
                fontWeight={600}
                isChecked={filter.postContent.includes(type)}
                onChange={() => handleChangeFilterContent(type)}
              >
                {type}
              </Checkbox>
            ))}
          </Stack>
        </Container>
      </Flex>
      <Flex p={2} flexDir={"column"}>
        <Container>
          <Text my={2} fontSize={18} fontWeight={600}>
            Post's type:{" "}
          </Text>
          <Stack spacing={3} direction={"column"}>
            {postType.map((type) => (
              <Checkbox
                size="md"
                colorScheme="green"
                key={type}
                textTransform={"capitalize"}
                fontWeight={600}
                isChecked={filter.postType.includes(type)}
                onChange={() => handleChangeFilterType(type)}
              >
                {type}
              </Checkbox>
            ))}
          </Stack>
        </Container>
      </Flex>
    </Flex>
  );
};

export default PostsFilterBar;

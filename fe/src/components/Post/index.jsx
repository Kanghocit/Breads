import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Image,
  Link,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import Actions from "../Actions";
import PostMoreActionBox from "./MoreAction";
import { updateSeeMedia } from "../../store/UtilSlice";
import { selectPost } from "../../store/PostSlice";

const Post = ({ post, isDetail }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [liked, setLiked] = useState(false);
  const [openPostBox, setOpenPostBox] = useState(false);

  const handleSeeDetail = () => {
    window.open(`/post/${1}`, "_self");
  };

  const handleSeeFullMedia = () => {
    dispatch(
      updateSeeMedia({
        open: true,
        img: "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/August2023/D6C07702-DD9D-49A4-9AD7-97C54D4949A0.jpeg",
      })
    );
    dispatch(
      selectPost({
        _id: "abc",
      })
    );
  };

  return (
    <Card>
      <CardBody>
        <Flex justifyContent={"space-between"}>
          <Popover trigger="hover" placement="bottom-start">
            <PopoverTrigger>
              <Link as={RouterLink} to={`/user/${userInfo._id}`}>
                <Flex w={"full"} alignItems={"center"} gap={3}>
                  <Avatar
                    src={post?.authorInfo?.avatar}
                    size={"md"}
                    name={post?.authorInfo?.username}
                    cursor={"pointer"}
                  />
                  <Flex>
                    <Text fontSize={"sm"} fontWeight={"bold"} cursor={"pointer"}>
                      {post?.authorInfo?.username}
                    </Text>
                    <Image src="/verified.png" w="4" h={4} ml={4} />
                  </Flex>
                </Flex>
              </Link>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverBody bg={"white"} color={"black"} borderRadius={"10px"}>
                <Box >
                  <Flex justifyContent={"space-between"}>
                  <Text fontWeight="bold">{userInfo?.username}</Text> 
                  <Avatar
                    src={post?.authorInfo?.avatar}
                    size={"md"}
                    name={post?.authorInfo?.username}
                    cursor={"pointer"}
                  />
                  </Flex>
                  <Text fontSize={"sm"}> {userInfo?.name}</Text>
                  <Text>{post?.content}</Text>
                  <Text color={"gray.400"}>{userInfo?.followers?.length || 0} người theo dõi</Text>
                  <Button w={"100%"} bg={"black"}>Theo dõi</Button>
                </Box>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          <Flex gap={4} alignItems={"center"}>
            <Text fontSize={"sm"} color={"gray.light"}>
              1d
            </Text>
            <Popover>
              <PopoverTrigger>
                <Button
                  bg={"transparent"}
                  borderRadius={"50%"}
                  width={"32px"}
                  height={"40px"}
                  padding={"0"}
                >
                  <BsThreeDots onClick={() => setOpenPostBox(!openPostBox)} />
                </Button>
              </PopoverTrigger>
              <PopoverContent width={"180px"}>
                <PopoverBody width={"180px"}>
                  <PostMoreActionBox user={userInfo} post={post} />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>
        </Flex>
        <Text my={3} cursor={"pointer"} onClick={() => handleSeeDetail()}>
          {post.content}
        </Text>
        {!!post.media?.length > 0 && (
          <Box
            borderRadius={6}
            overflow={"hidden"}
            border={"1px solid"}
            borderColor={"gray.light"}
            cursor={"pointer"}
            onClick={() => handleSeeFullMedia()}
          >
            <Image src={post.media[0].url} w={"full"} />
          </Box>
        )}
        <Flex gap={3} my={3}>
          <Actions liked={liked} setLiked={setLiked} />
        </Flex>
      </CardBody>
    </Card>
  );
};

export default Post;

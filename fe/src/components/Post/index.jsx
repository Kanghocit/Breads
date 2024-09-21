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
import Survey from "./Survey";
import moment from "moment";
import { Constants } from "../../../../share/Constants";

const Post = ({ post, isDetail }) => {
  //Temp
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [liked, setLiked] = useState(false);
  const [openPostBox, setOpenPostBox] = useState(false);

  const handleSeeDetail = () => {
    window.open(`/post/${1}`, "_self");
  };

  const handleSeeFullMedia = (img) => {
    dispatch(
      updateSeeMedia({
        open: true,
        img: img,
      })
    );
    //Temp
    dispatch(selectPost(post));
  };

  return (
    <Card>
      <CardBody>
        <Flex justifyContent={"space-between"}>
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

          <Flex gap={4} alignItems={"center"}>
            <Text fontSize={"sm"} color={"gray.light"}>
              {moment(post.createdAt).fromNow()}
            </Text>
            <Popover>
              <PopoverTrigger>
                <Button
                  bg={"transparent"}
                  borderRadius={"50%"}
                  width={"32px"}
                  height={"40px"}
                  padding={"0"}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setOpenPostBox(!openPostBox);
                  }}
                >
                  <BsThreeDots />
                </Button>
              </PopoverTrigger>
              {openPostBox && (
                <PopoverContent width={"180px"}>
                  <PopoverBody width={"180px"}>
                    <PostMoreActionBox
                      postId={post._id}
                      setOpenPostBox={setOpenPostBox}
                    />
                  </PopoverBody>
                </PopoverContent>
              )}
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
            onClick={() => handleSeeFullMedia(post.media[0].url)}
          >
            {post.media[0].type === Constants.MEDIA_TYPE.IMAGE ? (
              <Image src={post.media[0].url} w={"full"} />
            ) : (
              <video src={post.media[0].url} controls />
            )}
          </Box>
        )}
        {post.survey?.length > 0 && <Survey post={post} />}
        <Flex gap={3} my={3}>
          <Actions liked={liked} setLiked={setLiked} />
        </Flex>
      </CardBody>
    </Card>
  );
};

export default Post;

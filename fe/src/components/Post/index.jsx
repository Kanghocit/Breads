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
import moment from "moment";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { Constants } from "../../../../share/Constants";
import { selectPost } from "../../store/PostSlice";
import { updateSeeMedia } from "../../store/UtilSlice";
import ClickOutsideComponent from "../../util/ClickoutCPN";
import Actions from "../Actions";
import "./index.css";
import PostMoreActionBox from "./MoreAction";
import Survey from "./Survey";
import PopupCancel from "../../util/PopupCancel";
import usePopupCancel from "../../hooks/usePopupCancel";

const Post = ({ post, isDetail, isParentPost = false }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [openPostBox, setOpenPostBox] = useState(false);
  const { popupCancelInfo, setPopupCancelInfo, closePopupCancel } =
    usePopupCancel();

  const handleSeeDetail = () => {
    window.open(`/post/${post._id}`, "_self");
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
    <>
      <Card
        className="post-container"
        borderRadius={"12px"}
        border={isParentPost ? "1px solid gray" : ""}
      >
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
                      <Text
                        fontSize={"sm"}
                        fontWeight={"bold"}
                        cursor={"pointer"}
                      >
                        {post?.authorInfo?.username}
                      </Text>
                      <Image src="/verified.png" w="4" h={4} ml={4} />
                    </Flex>
                  </Flex>
                </Link>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody bg={"white"} color={"black"} borderRadius={"10px"}>
                  <Box>
                    <Flex justifyContent={"space-between"}>
                      <Text fontWeight="bold">{post.authorInfo?.username}</Text>
                      <Avatar
                        src={post?.authorInfo?.avatar}
                        size={"md"}
                        name={post?.authorInfo?.username}
                        cursor={"pointer"}
                      />
                    </Flex>
                    <Text fontSize={"sm"}> {post.authorInfo?.name}</Text>
                    <Text>{post?.content}</Text>
                    <Text color={"gray.400"}>
                      {post.authorInfo?.followers?.length || 0} người theo dõi
                    </Text>
                    <Button w={"100%"} bg={"black"}>
                      Theo dõi
                    </Button>
                  </Box>
                </PopoverBody>
              </PopoverContent>
            </Popover>

            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"sm"} color={"gray.light"}>
                {moment(post?.createdAt).fromNow()}
              </Text>
              {!isParentPost && (
                <div className="btn-more-action">
                  <ClickOutsideComponent
                    onClose={() => {
                      setOpenPostBox(false);
                    }}
                  >
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
                    {openPostBox && (
                      <PostMoreActionBox
                        post={post}
                        postId={post._id}
                        setOpenPostBox={setOpenPostBox}
                        setPopupCancelInfo={setPopupCancelInfo}
                        closePopupCancel={closePopupCancel}
                      />
                    )}
                  </ClickOutsideComponent>
                </div>
              )}
            </Flex>
          </Flex>
          <Text
            my={3}
            cursor={"pointer"}
            onClick={() => {
              if (!isDetail) {
                handleSeeDetail();
              }
            }}
          >
            {post?.content}
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
              {post.media[0].type === Constants.MEDIA_TYPE.VIDEO ? (
                <video src={post.media[0].url} controls />
              ) : (
                <Image src={post.media[0].url} w={"full"} alt="post-img" />
              )}
            </Box>
          )}
          {post.survey?.length > 0 && <Survey post={post} />}
          {post?.parentPostInfo && (
            <Post post={post?.parentPostInfo} isParentPost={true} />
          )}
          {!isParentPost && (
            <Flex gap={3} my={"10px"}>
              <Actions post={post} />
            </Flex>
          )}
        </CardBody>
      </Card>
      {popupCancelInfo.open && (
        <PopupCancel popupCancelInfo={popupCancelInfo} />
      )}
    </>
  );
};

export default Post;

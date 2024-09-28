import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
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
import { RiDoubleQuotesL } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Constants } from "../../../../share/Constants";
import usePopupCancel from "../../hooks/usePopupCancel";
import { selectPost } from "../../store/PostSlice";
import { updateSeeMedia } from "../../store/UtilSlice";
import ClickOutsideComponent from "../../util/ClickoutCPN";
import PopupCancel from "../../util/PopupCancel";
import PostConstants from "../../util/PostConstants";
import ViewActivity from "../PostPopup/ViewActivity";
import Actions from "./Actions";
import "./index.css";
import PostMoreActionBox from "./MoreAction";
import Survey from "./Survey";

const Post = ({ post, isDetail, isParentPost = false, isReply = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const postAction = useSelector((state) => state.post.postAction);
  const [openPostBox, setOpenPostBox] = useState(false);
  const { popupCancelInfo, setPopupCancelInfo, closePopupCancel } =
    usePopupCancel();

  const handleSeeDetail = () => {
    window.open(`/posts/${post._id}`, "_self");
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
        boxShadow={isReply ? "none" : ""}
        width={"100%"}
      >
        <CardBody padding={isReply ? "0px" : "1.25rem"}>
          <Flex justifyContent={"space-between"}>
            <Popover trigger="hover" placement="bottom-start">
              <Flex alignItems={"center"} gap={3}>
                <Avatar
                  src={post?.authorInfo?.avatar}
                  size={"md"}
                  name={post?.authorInfo?.username}
                  cursor={"pointer"}
                  position={"relative"}
                />
                <Flex>
                  <PopoverTrigger>
                    <Link as={RouterLink} to={`/user/${userInfo._id}`}>
                      <Text
                        fontSize={"sm"}
                        fontWeight={"bold"}
                        cursor={"pointer"}
                        _hover={{ textDecoration: "underline" }}
                      >
                        {post?.authorInfo?.username}
                      </Text>
                    </Link>
                  </PopoverTrigger>
                  <Image src="/verified.png" w="4" h={4} ml={2} />
                </Flex>
              </Flex>

              <PopoverContent
                position="absolute"
                top="-1"
                left="-7"
                transform="translateX(-50%)"
                borderRadius={"10px"}
              >
                <PopoverBody bg={"white"} color={"black"} borderRadius={"10px"}>
                  <Box m={2}>
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
                    <Button
                      w={"100%"}
                      bg={"black"}
                      color={"white"}
                      _hover={{ opacity: 0.8 }}
                      _active={{ opacity: 0.6 }}
                      transition="opacity 0.2s"
                    >
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
            my={2}
            cursor={
              !isDetail &&
              !(postAction === PostConstants.ACTIONS.REPOST && isParentPost)
                ? "pointer"
                : "text"
            }
            onClick={() => {
              if (
                !isDetail &&
                !(postAction === PostConstants.ACTIONS.REPOST && isParentPost)
              ) {
                handleSeeDetail();
              }
            }}
          >
            {post?.content}
          </Text>
          {isParentPost && post?.quote?._id && !postAction && (
            <Text
              display={"flex"}
              alignItems={"center"}
              gap={"4px"}
              color={"lightgray"}
              cursor={"pointer"}
              onClick={() => {
                navigate(`/posts/${post?.quote?._id}`);
              }}
            >
              <RiDoubleQuotesL />
              {post?.quote?.content}
            </Text>
          )}
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
          {post?.parentPostInfo?._id && (
            <>
              {post?.quote?._id && isParentPost ? (
                <Text
                  display={"flex"}
                  alignItems={"center"}
                  gap={"4px"}
                  color={"lightgray"}
                  cursor={"text"}
                >
                  <RiDoubleQuotesL />
                  {post.quote.content}
                </Text>
              ) : (
                <Post post={post?.parentPostInfo} isParentPost={true} />
              )}
            </>
          )}
          {!isParentPost && (
            <Flex gap={3} mt={"10px"} mb={isDetail ? "10px" : ""}>
              <Actions post={post} />
            </Flex>
          )}
          {isDetail && (
            <>
              <Divider />
              <Flex mt={4} justifyContent={"space-between"} m={1}>
                <Text p={2}>Thread reply</Text>
                <Flex
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  p={2}
                  cursor={"pointer"}
                  _hover={{
                    transform: "scale(1.05)",
                    transition: "transform 0.2s ease-in-out",
                  }}
                  onClick={onOpen} // Open modal on click
                >
                  <Text>View Activity</Text>
                  <ChevronRightIcon />
                </Flex>
              </Flex>
              <Divider />
              <ViewActivity post={post} isOpen={isOpen} onClose={onClose} />
              {post.replies?.length > 0 && (
                <Container
                  width={"100%"}
                  maxWidth={"100%"}
                  padding={"12px 0"}
                  mx={0}
                  boxShadow={"none"}
                  borderY={"1px solid gray"}
                >
                  {post.replies.map((reply) => (
                    <Post key={reply._id} post={reply} isReply={true} />
                  ))}
                </Container>
              )}
            </>
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

import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import moment from "moment";

import { useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { RiDoubleQuotesL } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Constants } from "../../../../share/Constants";
import usePopupCancel from "../../hooks/usePopupCancel";
import { selectPost } from "../../store/PostSlice";
import { updateSeeMedia } from "../../store/UtilSlice";
import ClickOutsideComponent from "../../util/ClickoutCPN";
import PopupCancel from "../../util/PopupCancel";
import PostConstants from "../../util/PostConstants";
import ViewActivity from "../PostPopup/ViewActivity";
import UserInfoPopover from "../UserInfoPopover";
import Actions from "./Actions";
import "./index.css";
import PostMoreActionBox from "./MoreAction";
import Survey from "./Survey";

const Post = ({ post, isDetail, isParentPost = false, isReply = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDragging = useRef(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const postAction = useSelector((state) => state.post.postAction);
  const [openPostBox, setOpenPostBox] = useState(false);
  const { popupCancelInfo, setPopupCancelInfo, closePopupCancel } =
    usePopupCancel();

  const mediaContainerRef = useRef(null);
  const startPosition = useRef(0);
  const scrollPosition = useRef(0);
  const velocity = useRef(0);
  const [momentum, setMomentum] = useState(false);
  const handleMouseDown = (e) => {
    isDragging.current = true;
    momentum && setMomentum(false);
    startPosition.current = e.pageX - mediaContainerRef.current.offsetLeft;
    scrollPosition.current = mediaContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const currentPosition = e.pageX - mediaContainerRef.current.offsetLeft;
    const distance = currentPosition - startPosition.current;
    velocity.current = distance;
    mediaContainerRef.current.scrollLeft = scrollPosition.current - distance;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    startMomentumScroll();
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      startMomentumScroll();
    }
  };

  const startMomentumScroll = () => {
    let momentumVelocity = velocity.current;
    if (momentumVelocity !== 0) {
      setMomentum(true);
      const inertiaInterval = setInterval(() => {
        mediaContainerRef.current.scrollLeft -= momentumVelocity * 0.95;
        momentumVelocity *= 0.95;
        if (Math.abs(momentumVelocity) < 0.5) {
          clearInterval(inertiaInterval);
          setMomentum(false);
        }
      }, 16);
    }
  };
  const handleSeeDetail = () => {
    window.open(`/posts/${post._id}`, "_self");
  };

  const handleSeeFullMedia = (media, index) => {
    dispatch(
      updateSeeMedia({
        open: true,
        media: media,
        currentMediaIndex: index,
      })
    );
    //Temp
    dispatch(selectPost(post));
  };

  return (
    <>
      <Card
        className="post-container"
        padding={isReply ? "6px" : ""}
        borderRadius={isReply ? "" : "12px"}
        border={isParentPost ? "1px solid gray" : ""}
        boxShadow={isReply ? "none" : ""}
        width={"100%"}
        borderBottom={isReply ? "1px solid gray" : ""}
      >
        <CardBody padding={isReply ? "8px 0" : "1.25rem"}>
          <Flex justifyContent={"space-between"}>
            <Flex alignItems={"center"} gap={3}>
              <Avatar
                src={post?.authorInfo?.avatar}
                size={"md"}
                name={post?.authorInfo?.username}
                cursor={"pointer"}
                position={"relative"}
              />
              <Flex>
                <UserInfoPopover
                  user={post?.authorInfo}
                  content={post?.content}
                />
              </Flex>
            </Flex>

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
            <Flex
              gap="10px"
              mt="10px"
              wrap={post.media.length <= 2 ? "wrap" : "nowrap"}
              justifyContent="flex-start"
              maxWidth="100%"
              border="1px solid gray"
              borderRadius="8px"
              overflowX={post.media.length > 2 ? "auto" : "hidden"}
              padding="10px"
              ref={mediaContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              css={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                "&": {
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                },
                cursor: isDragging.current || momentum ? "grabbing" : "grab",
              }}
            >
              {post.media.map((media, index) => (
                <Flex
                  key={index}
                  position="relative"
                  flexShrink={0}
                  gap="10px"
                  style={{
                    width: post.media.length === 1 ? "100%" : "calc(50% - 5px)",
                    maxWidth: post.media.length > 2 ? "200px" : "none",
                  }}
                >
                  {media.type === Constants.MEDIA_TYPE.VIDEO ? (
                    <video
                      loading="lazy"
                      src={media.url}
                      controls
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSeeFullMedia(post.media, index);
                      }}
                    />
                  ) : (
                    <Image
                      loading="lazy"
                      src={media.url}
                      alt={`Post Media ${index}`}
                      width="100%"
                      height={post.media.length === 1 ? "auto" : "200px"}
                      objectFit="cover"
                      borderRadius="8px"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSeeFullMedia(post.media, index);
                      }}
                    />
                  )}
                </Flex>
              ))}
            </Flex>
          )}

          {post.survey?.length > 0 && (
            <Survey post={post} isParentPost={isParentPost} />
          )}
          {post.parentPost && (
            <>
              {post?.parentPostInfo?._id ? (
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
              ) : (
                <>
                  {!isParentPost && (
                    <Flex
                      width={"100%"}
                      height={"40px"}
                      padding={"0"}
                      margin={"0"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      borderRadius={"10px"}
                      bg={"lightgray"}
                    >
                      <Text color={"gray"} fontWeight={600} fontSize={"14px"}>
                        Empty content
                      </Text>
                    </Flex>
                  )}
                </>
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
                  padding={"0"}
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

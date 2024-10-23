import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Flex,
  Text,
  Link,
  useColorMode,
} from "@chakra-ui/react";
import moment from "moment";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { RiDoubleQuotesL } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { POST_PATH } from "../../../Breads-Shared/APIConfig";
import usePopupCancel from "../../../hooks/usePopupCancel";
import useSocket from "../../../hooks/useSocket";
import { updatePostLike } from "../../../store/PostSlice";
import ClickOutsideComponent from "../../../util/ClickoutCPN";
import PopupCancel from "../../../util/PopupCancel";
import PostConstants from "../../../util/PostConstants";
import MediaDisplay from "../../PostPopup/mediaDisplay";
import ViewActivity from "../../PostPopup/ViewActivity";
import UserInfoPopover from "../../UserInfoPopover";
import Actions from "./Actions";
import "./index.css";
import PostMoreActionBox from "./MoreAction";
import Survey from "./Survey";

const Post = ({ post, isDetail, isParentPost = false, isReply = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { colorMode } = useColorMode();
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const postAction = useSelector((state) => state.post.postAction);
  const [openPostBox, setOpenPostBox] = useState(false);
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const usernameRegex = /(@[\w.]+)/g;
  const { popupCancelInfo, setPopupCancelInfo, closePopupCancel } =
    usePopupCancel();

  useSocket((socket) => {
    socket.on(POST_PATH.GET_ONE, ({ usersLike, postId }) => {
      if (post._id === postId) {
        dispatch(
          updatePostLike({
            postId,
            usersLike: usersLike,
          })
        );
      }
    });
  }, []);

  const handleSeeDetail = () => {
    window.open(`/posts/${post._id}`, "_self");
  };

  return (
    <>
      <Card
        className="post-container"
        borderRadius="12px"
        border={isParentPost ? "1px solid gray" : "none"}
        boxShadow={isReply ? "none" : "0 4px 12px rgba(0, 0, 0, 0.1)"}
        bg={colorMode === "dark" ? "#202020" : "#ffffff"}
        width="100%"
        transform={isParentPost ? "scale(1.02)" : "none"}
        transition="transform 0.2s ease"
      >
        <CardBody padding={isReply ? "0px" : "1.25rem"}>
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
              <Text
                fontSize={"sm"}
                color={colorMode === "dark" ? "gray.100" : "gray.light"}
              >
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
                      bg={colorMode === "dark" ? "#181818" : "#ffffff"}
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
            {post?.content
              ?.split(/(https?:\/\/[^\s]+|@[\w.]+)/g)
              .map((part, index) => {
                if (part.match(urlRegex)) {
                  return (
                    <Link
                      key={index}
                      href={part}
                      color="blue.500"
                      isExternal
                      _hover={{ textDecoration: "underline" }}
                      _focus={{ boxShadow: "none" }}
                    >
                      {part}
                    </Link>
                  );
                } else if (part.match(usernameRegex)) {
          
                  return (
                    <Link
                      key={index}
                      href={`/users/66eb9ec0d2857ebbd4ab4c5b`} 
                      color="blue.500"
                      _hover={{ textDecoration: "underline" }}
                      _focus={{ boxShadow: "none" }}
                    >
                      {part}
                    </Link>
                  );
                }
                return <span key={index}>{part}</span>;
              })}
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
          <MediaDisplay post={post} />
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
                  onClick={onOpen}
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

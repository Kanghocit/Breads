import { CloseIcon } from "@chakra-ui/icons";
import { Button, Flex, Image } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Constants } from "../../Breads-Shared/Constants";
import PostConstants from "../../Breads-Shared/Constants/PostConstants";
import { selectPost, updatePostInfo } from "../../store/PostSlice";
import { updateSeeMedia } from "../../store/UtilSlice";

const MediaDisplay = ({ post, isDetail }) => {
  const navigate = useNavigate();
  const postAction = useSelector((state) => state.post.postAction);
  const dispatch = useDispatch();
  const mediaContainerRef = useRef(null);
  const isDragging = useRef(false);
  const startPosition = useRef(0);
  const scrollPosition = useRef(0);
  const velocity = useRef(0);
  const [momentum, setMomentum] = useState(false);

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

  const handleRemoveMedia = (indexToRemove) => {
    const updatedMedia = post.media.filter(
      (_, index) => index !== indexToRemove
    );
    dispatch(updatePostInfo({ ...post, media: updatedMedia }));
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    momentum && setMomentum(false);
    startPosition.current = e.pageX - mediaContainerRef.current.offsetLeft;
    scrollPosition.current = mediaContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !mediaContainerRef.current) return;
    const currentPosition = e.pageX - mediaContainerRef.current.offsetLeft;
    const distance = currentPosition - startPosition.current;
    velocity.current = distance;
    mediaContainerRef.current.scrollLeft = scrollPosition.current - distance;
  };

  const handleMouseUp = (e) => {
    isDragging.current = false;
    startMomentumScroll(e);
  };

  const handleMouseLeave = (e) => {
    if (isDragging.current) {
      isDragging.current = false;
      startMomentumScroll(e);
    }
  };

  const startMomentumScroll = (e) => {
    e.preventDefault();
    if (!mediaContainerRef.current) return;
    let momentumVelocity = velocity.current;
    if (momentumVelocity !== 0) {
      setMomentum(true);
      const inertiaInterval = setInterval(() => {
        if (!mediaContainerRef.current) {
          clearInterval(inertiaInterval);
          return;
        }
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
    navigate(`/posts/${post._id}`);
  };

  return (
    post.media?.length > 0 && (
      <Flex
        gap="10px"
        mt="10px"
        zIndex={1}
        // bg={"red"}
        // bg={colorMode === "dark" ? "#181818" : "#fafafa"}
        wrap={post.media?.length <= 2 ? "wrap" : "nowrap"}
        justifyContent="flex-start"
        maxWidth="100%"
        borderRadius="8px"
        overflowX={post.media?.length > 2 ? "auto" : "hidden"}
        padding="6px 0"
        onClick={() => {
          const { REPOST, CREATE, REPLY } = PostConstants.ACTIONS;
          if (![REPOST, CREATE, REPLY].includes(postAction) && !isDetail) {
            handleSeeDetail();
          }
        }}
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
            objectFit={post.media?.length === 1 ? "contain" : "cover"}
          >
            {media.type === Constants.MEDIA_TYPE.VIDEO ? (
              <video
                loading="lazy"
                src={media.url}
                controls
                style={{
                  width: "auto",
                  height: "250px",
                  maxHeight: "300px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                onClick={() => {
                  if (!postAction) {
                    handleSeeFullMedia(post.media, index);
                  }
                }}
              />
            ) : (
              <Image
                loading="lazy"
                src={media.url}
                alt={`Post Media ${index}`}
                width="auto"
                height="250px"
                maxHeight="300px"
                borderRadius="8px"
                onDragStart={(e) => e.preventDefault()}
                onClick={(e) => {
                  if (!postAction) {
                    e.stopPropagation();
                    e.preventDefault();
                    handleSeeFullMedia(post.media, index);
                  }
                }}
              />
            )}

            {postAction === PostConstants.ACTIONS.CREATE && (
              <Button
                onClick={() => handleRemoveMedia(index)}
                size="sm"
                position="absolute"
                top="4px"
                right="4px"
                borderRadius="full"
                color="white"
                padding="4px"
                zIndex={1}
              >
                <CloseIcon boxSize="10px" />
              </Button>
            )}
          </Flex>
        ))}
      </Flex>
    )
  );
};

export default MediaDisplay;

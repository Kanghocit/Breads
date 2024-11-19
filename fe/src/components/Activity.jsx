import { Avatar, AvatarBadge, Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FaUser, FaRepeat } from "react-icons/fa6";
import { BiSolidShare } from "react-icons/bi";
import { BsThreads } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { IoImageOutline } from "react-icons/io5";
import { Constants } from "../Breads-Shared/Constants";
import { useNavigate } from "react-router-dom";
const Activity = ({ currentPage }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const notifications = useSelector(
    (state) => state.notification.notifications
  );

  const [isFollowing, setIsFollowing] = useState(false);
  const [uniqueNotifications, setUniqueNotifications] = useState([]);

  useEffect(() => {
    const seen = new Set();
    const unique = notifications.filter((notification) => {
      if (!seen.has(notification._id)) {
        seen.add(notification._id);
        return true;
      }
      return false;
    });
    setUniqueNotifications(unique);
  }, [notifications]);

  const { LIKE, FOLLOW, REPLY, REPOST, TAG } = Constants.NOTIFICATION_ACTION;
  const actionList = [
    {
      name: LIKE,
      icon: <FaHeart color="white" size={12} />,
      color: "red.600",
      actionText: "Đã thích bài viết của bạn",
    },
    {
      name: FOLLOW,
      icon: <FaUser color="white" size={12} />,
      color: "purple.500",
      actionText: "Đã theo dõi bạn",
    },
    {
      name: REPLY,
      icon: <BiSolidShare color="white" size={12} />,
      color: "blue.500",
      actionText: "Đã trả lời bài viết của bạn",
    },
    {
      name: REPOST,
      icon: <FaRepeat color="white" size={12} />,
      color: "#c329bf",
      actionText: "Đã đăng lại bài viết của bạn",
    },
    {
      name: TAG,
      icon: <BsThreads color="white" size={12} />,
      color: "green.500",
      actionText: "Đã tag bạn trong bài viết của họ",
    },
  ];

  const filteredNotifications = (() => {
    switch (currentPage) {
      case "follows":
        return uniqueNotifications.filter((item) => item.action === FOLLOW);
      case "likes":
        return uniqueNotifications.filter((item) => item.action === LIKE);
      case "reposts":
        return uniqueNotifications.filter((item) => item.action === REPOST);
      case "replies":
        return uniqueNotifications.filter((item) => item.action === REPLY);
      case "tags":
        return uniqueNotifications.filter((item) => item.action === TAG);
      default:
        return uniqueNotifications;
    }
  })();
  const comeToPost = (postId) => {
    navigate(`/posts/${postId}`);
  };
  const comeToUser = (userId) => {
    navigate(`/users/${userId}`);
  };

  return (
    <>
      {filteredNotifications.map((item) => {
        const actionDetails =
          actionList.find((action) => action.name === item.action) || {};
        console.log("item", item);
        return (
          <Flex
            key={item._id}
            w="full"
            alignItems="center"
            justifyContent="space-between"
            bg="#202020"
            p={3}
            borderRadius="10px"
            my={2}
          >
            {item.action !== FOLLOW ? (
              <Flex alignItems="center">
                <Avatar mr={4} src={item.fromUserDetails?.avatar}>
                  <AvatarBadge
                    boxSize="1.4em"
                    bg={actionDetails.color}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {actionDetails.icon}
                  </AvatarBadge>
                </Avatar>
                <Flex direction="column" wrap="wrap">
                  <Box display="flex">
                    <Text
                      fontWeight="bold"
                      mr={2}
                      fontSize={"sm"}
                      onClick={() => comeToUser(item.fromUser)}
                      cursor="pointer"
                      _hover={{ textDecoration: "underline" }}
                    >
                      {item.fromUserDetails?.username || "Unknown User"}
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                      {item.createdAt
                        ? formatDistanceToNow(new Date(item.createdAt), {
                            addSuffix: true,
                          })
                        : "Unknown time"}
                    </Text>
                  </Box>
                  <Text
                    color="white"
                    fontSize="sm"
                    onClick={() => comeToPost(item.target)}
                    cursor="pointer"
                  >
                    {item.postDetails?.content ? (
                      item.postDetails.content
                    ) : (
                      <IoImageOutline />
                    )}
                  </Text>
                </Flex>
              </Flex>
            ) : (
              <Flex alignItems="center" justifyContent="space-between" w="full">
                <Flex alignItems="center">
                  <Avatar mr={4} src={item.fromUserDetails?.avatar}>
                    <AvatarBadge
                      boxSize="1.4em"
                      bg={actionDetails.color}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {actionDetails.icon}
                    </AvatarBadge>
                  </Avatar>
                  <Flex direction="column">
                    <Box display="flex" justifyContent="space-between">
                      <Text fontWeight="bold" mr={2} fontSize={"sm"}>
                        {item.fromUserDetails?.username || "Unknown User"}
                      </Text>
                      <Text color="gray.500" fontSize="sm" whiteSpace="nowrap">
                        {item.createdAt
                          ? formatDistanceToNow(new Date(item.createdAt), {
                              addSuffix: true,
                            })
                          : "Unknown time"}
                      </Text>
                    </Box>

                    {item.name !== FOLLOW && (
                      <Text color="gray.600" fontSize="sm">
                        {actionDetails.actionText}
                      </Text>
                    )}
                  </Flex>
                </Flex>

                <Flex alignItems="center" justifyContent="flex-end" w="full">
                  <Button
                    bg="#232323"
                    color="white"
                    border="1px solid white"
                    size="sm"
                    _hover={{
                      bg: "#222222",
                      borderColor: "gray.600",
                    }}
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    {isFollowing ? t("following") : t("followback")}
                  </Button>
                </Flex>
              </Flex>
            )}
          </Flex>
        );
      })}
    </>
  );
};

export default Activity;

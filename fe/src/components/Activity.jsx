import { Avatar, AvatarBadge, Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { FaRepeat } from "react-icons/fa6";
import { BiSolidShare } from "react-icons/bi";
import { BsThreads } from "react-icons/bs";
import { useTranslation } from "react-i18next";

const Activity = () => {
  const { t } = useTranslation();
  const [isFollowed, setIsFollowed] = useState(false);
  const actionList = [
    {
      name: "like",
      icon: <FaHeart color="white" size={12} />,
      color: "red.600",
      user: "Khang",
      time: "7 Tuần",
      action: "Đã thích bài viết của bạn",
      content: "Nội dung bài viết",
    },
    {
      name: "follow",
      icon: <FaUser color="white" size={12} />,
      color: "purple.500",
      user: "Khang",
      time: "7 Tuần",
      action: "Đã theo dõi bạn",
      content: "",
      button: isFollowed ? t("followback") : t("following"),
    },
    {
      name: "reply",
      icon: <BiSolidShare color="white" size={12} />,
      color: "blue.500",
      user: "Khang",
      time: "7 Tuần",
      action: "Nội dung bài viết",
      content: "Nội dung bình luận bài viết",
    },
    {
      name: "repost",
      icon: <FaRepeat color="white" size={12} />,
      color: "#c329bf",
      user: "Khang",
      time: "7 Tuần",
      action: "Nội dung repost",
      content: "",
    },
    {
      name: "tag",
      icon: <BsThreads color="white" size={12} />,
      color: "green.500",
      user: "Khang",
      time: "7 Tuần",
      action: "Đã nhắc đến bạn",
      content: "Nội dung tag",
    },
  ];
  return (
    <>
      {actionList.map((item, index) => (
        <Flex
          key={index}
          w="full"
          alignItems="center"
          justifyContent="space-between"
          bg={"#202020"}
          p={3}
          borderRadius={"10px"}
          my={2}
        >
          <Flex alignItems="center">
            <Avatar mr={4}>
              <AvatarBadge
                boxSize="1.4em"
                bg={item.color}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {item.icon}
              </AvatarBadge>
            </Avatar>
            <Flex direction="column">
              <Box display="flex" alignItems="center">
                <Text fontWeight="bold" mr={2}>
                  {item.user}
                </Text>
                <Text color="gray.500">{item.time}</Text>
              </Box>
              <Text color="gray.600">{item.action}</Text>
              <Text color="white">{item.content}</Text>
            </Flex>
          </Flex>
          {item.button && (
            <Button
              borderColor={isFollowed ? "#6c6c6c" : "#777777"}
              color={isFollowed ? "white" : "#777777"}
              variant="outline"
              size="sm"
              onClick={() => setIsFollowed(!isFollowed)}
            >
              {item.button}
            </Button>
          )}
        </Flex>
      ))}
    </>
  );
};

export default Activity;

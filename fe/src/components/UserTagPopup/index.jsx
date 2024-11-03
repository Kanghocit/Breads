import {
  Avatar,
  Box,
  Flex,
  Link,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useColorMode,
} from "@chakra-ui/react";

import { Fragment, useState } from "react";

const UserTagPopup = ({ post, content }) => {
  const tagInfo = post.usersTagInfo || [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const usernameRegex = /@[\w.]+/;
  const { colorMode } = useColorMode();

  const bgColor = colorMode === "dark" ? "#0a0a0a" : "#fafafa";

  let firstUrlPreviewDisplayed = false;

  return (
    <>
      {content?.split(/(https?:\/\/[^\s]+|@[\w.]+)/g).map((part, index) => {
        if (part.match(urlRegex)) {
          if (!firstUrlPreviewDisplayed) {
            firstUrlPreviewDisplayed = true;
            return (
              <>
                <div
                  key={index}
                  style={{ marginBottom: "10px", display: "inline" }}
                >
                  <Link
                    href={part}
                    color="blue.500"
                    isExternal
                    _hover={{ textDecoration: "underline" }}
                    _focus={{ boxShadow: "none" }}
                  >
                    {part}
                  </Link>
                </div>
              </>
            );
          }
          return (
            <>
              <span key={index} style={{ marginRight: "5px" }}>
                <Link
                  href={part}
                  color="blue.500"
                  isExternal
                  _hover={{ textDecoration: "underline" }}
                  _focus={{ boxShadow: "none" }}
                >
                  {part}
                </Link>
              </span>
           
            <Fragment key={"tag-popup-" + index}>
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
            </Fragment>
            </>
          );

        } else if (part.match(usernameRegex)) {
          const matchedUser = tagInfo.find(
            (user) => `@${user.username}` === part
          );

          return (
            <Popover trigger="hover" placement="bottom-start" key={index}>
              <PopoverTrigger>
                <Link
                  href={matchedUser ? `/users/${matchedUser._id}` : "#"}
                  color="blue.500"
                  _hover={{ textDecoration: "underline" }}
                  _focus={{ boxShadow: "none" }}
                >
                  {part}
                </Link>
              </PopoverTrigger>
              {matchedUser && (
                <PopoverContent
                  top="-1"
                  left="-1"
                  transform="translateX(-50%)"
                  borderRadius={"10px"}
                  zIndex={10000}
                >
                  <PopoverBody
                    bg={bgColor}
                    color={colorMode === "dark" ? "white" : "black"}
                    borderRadius={"10px"}
                  >
                    <Box m={2}>
                      <Flex justifyContent={"space-between"} pb={4}>
                        <Box>
                          <Text fontWeight="bold">{matchedUser.username}</Text>
                          <Text fontSize={"sm"}>{matchedUser.name}</Text>
                        </Box>
                        <Avatar
                          src={matchedUser.avatar}
                          size={"md"}
                          name={matchedUser.username}
                          cursor={"pointer"}
                        />
                      </Flex>
                      <Text fontSize={"sm"}>{matchedUser.bio}</Text>
                      <Text color={"gray.400"}>
                        {matchedUser.followed?.length || 0} followers
                      </Text>
                    </Box>
                  </PopoverBody>
                </PopoverContent>
              )}
            </Popover>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};

export default UserTagPopup;

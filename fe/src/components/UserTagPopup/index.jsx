import {
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Box,
  Flex,
  Text,
  Avatar,
} from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import { useState } from "react";

const UserTagPopup = ({ post, content }) => {
  const tagInfo = post.usersTagInfo || [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const usernameRegex = /@[\w.]+/;
  const { colorMode } = useColorMode();

  const bgColor = colorMode === "dark" ? "#0a0a0a" : "#fafafa";

  return (
    <>
      {content?.split(/(https?:\/\/[^\s]+|@[\w.]+)/g).map((part, index) => {
        if (part.match(urlRegex)) {
          return (
            <>
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
              <div
                style={{
                  border: "1px solid #e0e0e0",
                  height: "80px",
                  borderRadius: "8px",
                  backgroundColor: bgColor,
                  padding: "10px",
                  marginTop: "8px",
                  maxWidth: "100%",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "box-shadow 0.2s ease-in-out",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "gray",
                        fontSize: "10px",
                        marginRight: "5px",
                      }}
                    >
                      {extractDomain1(part)}
                    </div>
                    <div
                      style={{
                        color: "white",
                        fontSize: "20px",
                        marginRight: "5px",
                      }}
                    >
                      {extractDomain2(part)}
                    </div>
                  </div>
                </div>
              </div>
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

const extractDomain1 = (url) => {
  const match = url.match(/https?:\/\/(?:www\.)?([^\/]+)/i);
  return match ? match[1] : ""; // Return the full domain
};
const extractDomain2 = (url) => {
  const match = url.match(/https?:\/\/(?:www\.)?([^\/]+)/i);
  if (match) {
    const domain = match[1];
    // Tách tên miền theo dấu chấm và lấy phần đầu tiên
    return domain.split(".")[0];
  }
  return ""; // Trả về chuỗi rỗng nếu không có kết quả
};

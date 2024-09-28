// ViewActivity.jsx
import {
  Avatar,
  Box,
  Container,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { BsChatRightQuote } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { TbMessageReply } from "react-icons/tb";

const ViewActivity = ({ post, isOpen, onClose }) => {
  const actionsArray = [
    {
      action: CiHeart,
      num: post.usersLike?.length,
      name: "Likes",
    },
    {
      action: TbMessageReply,
      num: post.replies?.length,
      name: "Replies",
    },
    {
      action: BsChatRightQuote,
      num: post?.repostNum,
      name: "Reposts",
    },
  ];
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        position={"relative"}
        boxSizing="border-box"
        width="500px"
        maxWidth={"620px"}
        bg={"white"}
        color={"gray"}
        pr={1}
        borderRadius={"16px"}
        id="modal"
      >
        <Box p={1}></Box>
        <ModalHeader textAlign={"center"}>Activity Details</ModalHeader>

        <ModalBody>
          <Flex
            border="1px solid #999"
            borderRadius="8px"
            p={4}
            m={2}
            bg="gray.50"
            boxShadow="md"
            alignItems="center"
            justifyContent="space-between"
          >
            <Avatar
              src={post.authorInfo.avatar}
              width={"40px"}
              height={"40px"}
            />
            <Container margin="0" paddingRight={0}>
              <Text color="black" fontWeight={"600"}>
                {post.authorInfo.username}
              </Text>
              <Text>{post.content}</Text>
            </Container>
          </Flex>
          <Box>
            {actionsArray.map((item, index) => (
              <Box key={index} m={1}>
                <Flex justifyContent={"space-between"} alignItems="center">
                  <Box
                    display="flex"
                    alignItems="center"
                    borderRadius="8px"
                    p={2}
                  >
                    <Flex alignItems="center">
                      <item.action style={{ marginRight: "8px" }} />
                      <Text fontWeight="semibold" fontSize="lg">
                        {item.name}
                      </Text>
                    </Flex>
                  </Box>
                  <Text alignItems="center" p={2}>
                    {item.num}
                  </Text>
                </Flex>
                <Box pl={"30px"}>
                  <Divider borderColor="gray.300" />
                </Box>
              </Box>
            ))}
          </Box>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewActivity;

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  Flex,
  Avatar,
  Container,
  Image,
  Divider,
} from "@chakra-ui/react";
import TextArea from "../../util/TextArea";
import { FaRegEye } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { useSelector } from "react-redux";
function ViewActivity({ post, isOpen, onClose }) {
  const actionsArray = [
    {
      action: FaRegEye,
      num: 9999,
      name: "View",
    },
    {
      action: CiHeart,
      num: 5678,
      name: "Likes",
    },
    {
      action: CiHeart,
      num: 2,
      name: "Reports",
    },
  ];
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        position={"relative"}
        boxSizing="border-box"
        width="580px"
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
              <TextArea text={post.content} />
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
}
export default ViewActivity;

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Textarea,
  Text,
  Box,
  Image,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import useShowToast from "../../../hooks/useShowToast";

const UpdatePost = ({ isOpen, onClose, post }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const showToast = useShowToast();
  const [inputs, setInputs] = useState({
    content: post.content,
  });
  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/posts/update/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", "Post updated successfully!", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        position={"relative"}
        boxSizing="border-box"
        width="600px"
        maxWidth={"620px"}
        bg={"white"}
        color={"gray"}
        borderRadius={"16px"}
        id="modal"
      >
        <Box p={1}></Box>
        <Text
          position={"absolute"}
          top={"-36px"}
          left={"50%"}
          transform={"translateX(-50%)"}
          color={"white"}
          zIndex={4000}
          textTransform={"capitalize"}
          fontWeight={600}
          fontSize={"18px"}
        >
          Update Post
        </Text>
        <ModalCloseButton
          position={"absolute"}
          top={"-36px"}
          left={"0"}
          color={"white"}
        />

        <ModalBody mr={4}>
          <Input
            onChange={(e) => setInputs({ ...inputs, text: e.target.value })}
            value={inputs.text}
            placeholder="Update post title"
            defaultValue={post.content}
            border={"none"}
            pl={0}
          />
          {!!post.media?.length > 0 && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
              cursor={"pointer"}
            >
              <Image src={post.media[0].url} w={"full"} />
            </Box>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" colorScheme="green" onClick={handleUpdate}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdatePost;

import { useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import useUpdatePost from "./useUpdatePost";

const PostUpdateModal = ({ isOpen, onClose, post, user }) => {
  const [inputs, setInputs] = useState({ text: post.text });
  const [imgUrl, setImgUrl] = useState(post.img);
  const imageRef = useRef(null);

  const { handleUpdateClick, updating } = useUpdatePost(onClose);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    await handleUpdateClick(post, inputs, imgUrl);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={"gray.dark"}>
        <ModalHeader>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Avatar size={"md"} name={user.name} src={user.profilePicture} />
              <Text fontSize={"sm"} fontWeight={"bold"} ml={2}>
                {user.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            onChange={(e) => setInputs({ ...inputs, text: e.target.value })}
            value={inputs.text}
            type="text"
            border="none"
            padding="0"
            borderRadius="md"
            _focus={{ boxShadow: "none" }}
            placeholder="Enter text"
          />

          <Box
            borderRadius={"6"}
            overflow={"hidden"}
            border={"1px solid"}
            borderColor={"gray.light"}
          >
            <Input type="file" hidden ref={imageRef} onChange={handleImageChange} />
            <Image
              src={imgUrl || post.img}
              w={"full"}
              onClick={() => imageRef.current.click()}
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            bg={"green.400"}
            color={"white"}
            _hover={{ bg: "green.500" }}
            onClick={handleSave}
            isLoading={updating}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PostUpdateModal;

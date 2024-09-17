import {
    Button,
    CloseButton,
    Flex,
    FormControl,
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
    Textarea,
    useColorModeValue,
  } from "@chakra-ui/react";
  import { BsFillImageFill } from "react-icons/bs";
  import { useState, useRef } from "react";
  import { POST } from "../../config/API";
  import usePreviewImg from "../../hooks/usePreviewImg";
  import useShowToast from "../../hooks/useShowToast";
  import { useSelector } from "react-redux";
  
  const MAX_CHAR = 500;
  
  const CreatePostModal = ({ isOpen, onClose }) => {
    const [postText, setPostText] = useState("");
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const imageRef = useRef(null);
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const user = useSelector((state) => state.user.userInfo);
    const showToast = useShowToast();
    const [loading, setLoading] = useState(false);
  
    const handleTextChange = (e) => {
      const inputText = e.target.value;
      if (inputText.length > MAX_CHAR) {
        setPostText(inputText.slice(0, MAX_CHAR));
        setRemainingChar(0);
      } else {
        setPostText(inputText);
        setRemainingChar(MAX_CHAR - inputText.length);
      }
    };
  
    const handleCreatePost = async () => {
      setLoading(true);
      try {
        const payload = { postedBy: user._id, text: postText, img: imgUrl };
        const data = await POST({ path: "api/posts/create", payload });
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        showToast("Success", "Post created successfully", "success");
        onClose();
        setPostText("");
        setImgUrl("");
      } catch (error) {
        showToast("Error", "Something went wrong", "error");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Post content goes here.."
                onChange={handleTextChange}
                value={postText}
              />
              <Text fontSize={"xs"} fontWeight={"bold"} textAlign={"right"} m={"1"}>
                {remainingChar}/{MAX_CHAR}
              </Text>
              <Input type="file" hidden ref={imageRef} onChange={handleImageChange} />
              <BsFillImageFill style={{ marginLeft: "5px", cursor: "pointer" }} size={16} onClick={() => imageRef.current.click()} />
            </FormControl>
            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected img" />
                <CloseButton onClick={() => setImgUrl("")} bg={"gray.800"} position={"absolute"} top={2} right={2} />
              </Flex>
            )}
          </ModalBody>
  
          <ModalFooter>
            <Button  mr={3} onClick={handleCreatePost} isLoading={loading}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default CreatePostModal;
  
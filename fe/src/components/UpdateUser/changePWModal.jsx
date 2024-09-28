import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

const ChangePWModal = ({ setPopup }) => {
  return (
    <Modal
      isOpen={true}
      onClose={() => {
        setPopup({
          isOpen: false,
          type: "",
        });
      }}
    >
      <ModalOverlay />
      <ModalContent
        position={"relative"}
        boxSizing="border-box"
        width="460px"
        maxWidth={"620px"}
        bg={"white"}
        color={"gray"}
        borderRadius={"16px"}
        id="modal"
        padding={"4px 8px"}
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
          Change password
        </Text>
        <ModalCloseButton
          position={"absolute"}
          top={"-36px"}
          left={"0"}
          color={"white"}
        />
        <ModalBody>
          <FormControl>
            <FormLabel>Current password</FormLabel>
            <Input
              placeholder="Your current password"
              _placeholder={{ color: "gray.500" }}
              type="password"
            />
          </FormControl>
          <FormControl>
            <FormLabel>New password</FormLabel>
            <Input
              placeholder="New password"
              _placeholder={{ color: "gray.500" }}
              type="password"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              setPopup({
                isOpen: false,
                type: "",
              });
            }}
          >
            Close
          </Button>
          <Button variant="">Update password</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangePWModal;

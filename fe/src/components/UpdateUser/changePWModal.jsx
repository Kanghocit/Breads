import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
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
import { useState } from "react";
import { useSelector } from "react-redux";
import { PUT } from "../../config/API";
import useShowToast from "../../hooks/useShowToast";
import { Route, USER_PATH } from "../../../../share/APIConfig";

const ChangePWModal = ({ setPopup }) => {
  const showToast = useShowToast();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [passwordInfo, setPasswordInfo] = useState({
    currentPW: {
      hidden: true,
      value: "",
    },
    newPW: {
      hidden: true,
      value: "",
    },
  });

  const handleUpdatePW = async () => {
    try {
      const currentPWValue = passwordInfo.currentPW.value;
      const newPWValue = passwordInfo.newPW.value;
      if (newPWValue.trim().length < 6) {
        showToast("", "Password must have at least 6 characters");
        return;
      }
      await PUT({
        path: Route.USER + USER_PATH.CHANGE_PW + userInfo._id,
        payload: {
          currentPW: currentPWValue,
          newPW: newPWValue,
        },
        showToast: showToast,
      });
      showToast("", "Update success", "success");
      setPopup({
        isOpen: false,
        type: "",
      });
    } catch (err) {
      setPopup({
        isOpen: false,
        type: "",
      });
    }
  };

  const updateFieldValue = (value, isCurrentPW) => {
    const cloneState = { ...passwordInfo };
    if (isCurrentPW) {
      cloneState.currentPW.value = value;
    } else {
      cloneState.newPW.value = value;
    }
    setPasswordInfo(cloneState);
  };

  const visiblePW = (isCurrentPW) => {
    const cloneState = { ...passwordInfo };
    if (isCurrentPW) {
      cloneState.currentPW.hidden = !cloneState.currentPW.hidden;
    } else {
      cloneState.newPW.hidden = !cloneState.newPW.hidden;
    }
    setPasswordInfo(cloneState);
  };

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
            <Flex
              alignItems={"center"}
              gap={"6px"}
              border={"1px solid gray"}
              borderRadius={"6px"}
              padding={"0 12px"}
            >
              <Input
                placeholder="Your current password"
                _placeholder={{ color: "gray.500" }}
                padding="0"
                border={"none"}
                outline={"none"}
                _focus={{
                  boxShadow: "none",
                }}
                type={passwordInfo.currentPW.hidden ? "password" : "text"}
                value={passwordInfo.currentPW.value}
                onChange={(e) => updateFieldValue(e.target.value, true)}
              />
              {passwordInfo.currentPW.hidden ? (
                <ViewIcon
                  width={"24px"}
                  height={"18px"}
                  cursor={"pointer"}
                  onClick={() => visiblePW(true)}
                />
              ) : (
                <ViewOffIcon
                  width={"24px"}
                  height={"18px"}
                  cursor={"pointer"}
                  onClick={() => visiblePW(true)}
                />
              )}
            </Flex>
          </FormControl>
          <FormControl>
            <FormLabel>New password</FormLabel>
            <Flex
              alignItems={"center"}
              gap={"6px"}
              border={"1px solid gray"}
              borderRadius={"6px"}
              padding={"0 12px"}
            >
              <Input
                placeholder="New password"
                _placeholder={{ color: "gray.500" }}
                padding="0"
                border={"none"}
                outline={"none"}
                _focus={{
                  boxShadow: "none",
                }}
                type={passwordInfo.newPW.hidden ? "password" : "text"}
                value={passwordInfo.newPW.value}
                onChange={(e) => updateFieldValue(e.target.value, false)}
              />
              {passwordInfo.newPW.hidden ? (
                <ViewIcon
                  width={"24px"}
                  height={"18px"}
                  cursor={"pointer"}
                  onClick={() => visiblePW(false)}
                />
              ) : (
                <ViewOffIcon
                  width={"24px"}
                  height={"18px"}
                  cursor={"pointer"}
                  onClick={() => visiblePW(false)}
                />
              )}
            </Flex>
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
          <Button
            variant=""
            onClick={() => {
              if (userInfo?._id) {
                handleUpdatePW();
              }
            }}
          >
            Update password
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangePWModal;

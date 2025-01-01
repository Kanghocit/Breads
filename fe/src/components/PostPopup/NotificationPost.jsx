import {
  Box,
  Button,
  Flex,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { CloseIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";

const NotificationCreatePost = ({ postId, onClose }) => {
  const { t } = useTranslation();
  const bgColor = useColorModeValue("ccl.light", "#444");
  const textColor = useColorModeValue("ccl.dark", "ccl.light");
  const navigate = useNavigate();

  const handleViewPost = () => {
    navigate(`/posts/${postId}`);
    onClose();
  };

  return (
    <Box
      position="fixed"
      bottom={["60px", "60px", "20px"]}
      left="50%"
      transform="translateX(-50%)"
      bg={bgColor}
      borderRadius="8px"
      padding="12px 16px"
      zIndex="2000"
      boxShadow="lg"
      minWidth="280px"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Text color={textColor} m={0}>
          {t("toastCreadtedPost")}
        </Text>
        {/* <Text
          m={0}
          mx={[0, "10px"]}
          color={"blue.300"}
          textDecoration="underline"
          cursor={"pointer"}
          onClick={handleViewPost}
        >
          {t("show")}
        </Text> */}

        <Button
          position="absolute"
          top="-10px"
          right="-10px"
          size="sm"
          bg={bgColor}
          onClick={onClose}
          variant="unstyled"
          _hover={{
            backgroundColor: bgColor,
          }}
          boxShadow={useColorModeValue(
            "0px 2px 4px rgba(255, 255, 255, 0.3)",
            "0px 2px 4px rgba(0, 0, 0, 0.2)"
          )}
          borderRadius="full"
          color="white"
          padding="4px"
        >
          <CloseIcon boxSize="8px" color={textColor} />
        </Button>
      </Flex>
    </Box>
  );
};

export default NotificationCreatePost;

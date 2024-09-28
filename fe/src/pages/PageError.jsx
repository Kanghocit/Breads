import { Button, Flex, Text, Box, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const PageError = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      h="100vh"
      p={4}
      
    >
      <Box textAlign="center" mb={4}>
        <Heading as="h2" size="lg" color="red.500">
          404 - Page Not Found
        </Heading>
        <Text fontSize="lg" mt={2}>
          Sorry, this page does not exist.
        </Text>
        <Text fontSize="md">
          The link you are visiting may be broken or the page may have been taken down.
        </Text>
      </Box>
      <Button onClick={handleBack}>
        Come Back
      </Button>
    </Flex>
  );
};

export default PageError;

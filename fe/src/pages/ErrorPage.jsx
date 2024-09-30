import { Container, Text, Button, Image, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <Container
      maxW="container.md"
      textAlign="center"
      py={10}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      
      <VStack spacing={4}>
        <Text fontSize="4xl" fontWeight="bold" color="red.500">
          Oops! Something went wrong.
        </Text>
        <Text fontSize="lg" color="gray.600">
          The page you're looking for doesn't exist or an error occurred.
        </Text>
        <Button onClick={handleGoBack}>Go Back</Button>
      </VStack>
    </Container>
  );
};

export default ErrorPage;

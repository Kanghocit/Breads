import { Container, Text, Button, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // Nhập i18n

const ErrorPage = () => {
  const { t } = useTranslation(); // Khai báo hook i18n
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/"); // Quay lại trang chính
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
          {t('error.oops')} 
        </Text>
        <Text fontSize="lg" color="gray.600">
          {t('error.message')} 
        </Text>
        <Button 
          onClick={handleGoBack} 
          
          
        >
          {t('error.goBack')} 
        </Button>
      </VStack>
    </Container>
  );
};

export default ErrorPage;
